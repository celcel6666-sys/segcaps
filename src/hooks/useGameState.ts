import { useState, useCallback } from 'react';
import { DEPARTMENTS } from '../data/departments';
import type { Department } from '../data/departments';
import { QUIZZES_DATA } from '../data/quizzes';
import type { DeptQuizData } from '../data/quizzes';


export type GameStep = 
  | 'TITLE'            // 오프닝 타이틀 화면
  | 'INTRO_STORY'      // 듬이의 공통 소개 (세경고 전경 배경)
  | 'DEPT_INTRO'       // 특정 학과 진입 인트로 대화
  | 'DEPT_QUIZ'        // 학과별 퀴즈/미션 진행
  | 'DEPT_REWARD'      // 학과 통과 시 뱃지 획득 팝업
  | 'RESULT';          // 최종 MBTI식 결과 리포트

export interface GameState {
  currentStep: GameStep;
  currentDeptIndex: number;
  dialogueIndex: number;
  currentQuizIndex: number; // 학과 내부의 3대 전공 퀴즈 인덱스 (0, 1, 2)
  correctCount: number;      // 3문제 중 맞춘 횟수 기록
  badgeList: string[];
  scores: Record<string, number>;
  isLastQuizCorrect: boolean;
}

const INITIAL_STATE: GameState = {
  currentStep: 'TITLE',
  currentDeptIndex: 0,
  dialogueIndex: 0,
  currentQuizIndex: 0,
  correctCount: 0,
  badgeList: [],
  scores: {
    artistic: 0,
    caring: 0,
    logical: 0,
    spatial: 0,
    technical: 0,
    precision: 0,
    responsibility: 0,
  },
  isLastQuizCorrect: false,
};

// 공유 링크 진입(?result=DEPT_ID)을 감지하여 진단 결과화면(RESULT)으로 스킵 랜딩 초기화
const getInitialState = (): GameState => {
  const params = new URLSearchParams(window.location.search);
  const resultDeptId = params.get('result');

  if (resultDeptId) {
    const matchedDept = DEPARTMENTS.find(d => d.id === resultDeptId);
    if (matchedDept) {
      return {
        currentStep: 'RESULT',
        currentDeptIndex: 0,
        dialogueIndex: 0,
        currentQuizIndex: 0,
        correctCount: 0,
        badgeList: [matchedDept.id],
        scores: {
          artistic: matchedDept.id === 'MEDIA' ? 10 : 0,
          caring: matchedDept.id === 'NURSING' ? 10 : 0,
          logical: matchedDept.id === 'SEMICONDUCTOR' ? 10 : 0,
          spatial: matchedDept.id === 'ARCHITECTURE' ? 10 : 0,
          technical: matchedDept.id === 'AUTOMOTIVE' ? 10 : 0,
          precision: matchedDept.id === 'AVIONICS' ? 10 : 0,
          responsibility: matchedDept.id === 'MILITARY' ? 10 : 0,
        },
        isLastQuizCorrect: true,
      };
    }
  }

  return INITIAL_STATE;
};

export const useGameState = () => {
  const [state, setState] = useState<GameState>(getInitialState);

  // 공통 인트로 대화 리스트 (미연시 선택지 choices 완벽 매핑)
  const INTRO_DIALOGUES = [
    { text: "안녕! 세경고등학교 탐험을 온 걸 환영해! 난 오늘 안내를 맡은 듬이야.", expression: 'default', choices: ["우와, 듬이 안녕! 반가워! 👋", "여기가 세경고구나!"] },
    { text: "세경고등학교에는 아주 특별한 개성을 가진 7개의 전공 학과가 있어.", expression: 'default', choices: ["어떤 학과들이 있는지 궁금해!", "재밌는 곳이 많겠네!"] },
    { text: "네게 가장 잘 맞는 꿈의 학과는 어디일까? 나랑 같이 학교 곳곳을 둘러보고 체험해보자!", expression: 'paint', choices: ["좋아, 나도 얼른 알아보고 싶어!"] },
    { text: "각 학과의 퀴즈를 맞추거나 체험을 완수하면 멋진 전공 뱃지도 모을 수 있어.", expression: 'smile', choices: ["오! 뱃지 수집이라니 설렌다 🎖️"] },
    { text: "자, 그럼 활기찬 기운이 가득한 세경 운동장과 각 학과 교실로 바로 출발해보자! 🚀", expression: 'wink', choices: ["출발하자, 듬이야! ✨"] }
  ];

  const currentDept: Department = DEPARTMENTS[state.currentDeptIndex];
  const currentDeptQuiz: DeptQuizData = QUIZZES_DATA[currentDept.id];

  // 1. 게임 타이틀 -> 공통 인트로 진입
  const startGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: 'INTRO_STORY',
      dialogueIndex: 0
    }));
  }, []);

  // 2. 대화 인덱스 진행 및 단계 전환 (미연시 답변 버튼 선택에 의해 연동)
  const nextDialogue = useCallback(() => {
    setState(prev => {
      // (1) 공통 인트로 대화 중인 경우
      if (prev.currentStep === 'INTRO_STORY') {
        if (prev.dialogueIndex < INTRO_DIALOGUES.length - 1) {
          return { ...prev, dialogueIndex: prev.dialogueIndex + 1 };
        } else {
          return {
            ...prev,
            currentStep: 'DEPT_INTRO',
            currentDeptIndex: 0,
            dialogueIndex: 0
          };
        }
      }

      // (2) 개별 학과 인트로 대화 중인 경우
      if (prev.currentStep === 'DEPT_INTRO') {
        const introTexts = QUIZZES_DATA[DEPARTMENTS[prev.currentDeptIndex].id].introDialogue;
        if (prev.dialogueIndex < introTexts.length - 1) {
          return { ...prev, dialogueIndex: prev.dialogueIndex + 1 };
        } else {
          // 학과 대화 끝나면 0번째 퀴즈 시작 및 맞춘 횟수 리셋
          return {
            ...prev,
            currentStep: 'DEPT_QUIZ',
            currentQuizIndex: 0,
            correctCount: 0,
            dialogueIndex: 0
          };
        }
      }

      // (3) 개별 학과 아웃트로 대화(DEPT_REWARD) 중인 경우
      if (prev.currentStep === 'DEPT_REWARD') {
        const deptId = DEPARTMENTS[prev.currentDeptIndex].id;
        const outroTexts = prev.isLastQuizCorrect 
          ? QUIZZES_DATA[deptId].outroDialogueSuccess 
          : QUIZZES_DATA[deptId].outroDialogueFail;
          
        if (prev.dialogueIndex < outroTexts.length - 1) {
          return { ...prev, dialogueIndex: prev.dialogueIndex + 1 };
        } else {
          // 대화가 끝났으므로, dialogueIndex를 대사 개수 이상으로 밀어서 완료 상태로 만듦
          return { ...prev, dialogueIndex: prev.dialogueIndex + 1 };
        }
      }

      return prev;
    });
  }, [INTRO_DIALOGUES.length]);

  // 3. 퀴즈 제출 및 다문항 다중 순회 처리
  const submitAnswer = useCallback((isCorrect: boolean) => {
    setState(prev => {
      const dept = DEPARTMENTS[prev.currentDeptIndex];
      const deptQuiz = QUIZZES_DATA[dept.id];
      const newScores = { ...prev.scores };
      
      // 정답 수 누계 계산
      const newCorrectCount = isCorrect ? prev.correctCount + 1 : prev.correctCount;

      // 현재 퀴즈의 배점 가져오기 (미정의 시 기본 25점)
      const currentQuiz = deptQuiz.quizzes[prev.currentQuizIndex];
      const questionPoints = currentQuiz.points ?? 25;

      // 정답이면 해당 문제 배점만큼 누적, 오답이면 점수 변동 없음
      if (isCorrect) {
        newScores[dept.scoreKey] = (newScores[dept.scoreKey] || 0) + questionPoints;
      }

      // (1) 아직 해당 학과의 퀴즈가 더 남아있는 경우 다음 퀴즈 문제로 진행
      if (prev.currentQuizIndex < deptQuiz.quizzes.length - 1) {
        return {
          ...prev,
          scores: newScores,
          correctCount: newCorrectCount,
          currentQuizIndex: prev.currentQuizIndex + 1
        };
      }

      // (2) 학과의 모든 퀴즈 문제를 다 풀었을 때 최종 통과 판정 (3문제 이상 정답 시 성공)
      const passThreshold = 3;
      const isFinalSuccess = newCorrectCount >= passThreshold;

      return {
        ...prev,
        correctCount: newCorrectCount,
        scores: newScores,
        isLastQuizCorrect: isFinalSuccess,
        dialogueIndex: 0, // 🎬 아웃트로 컷씬을 처음부터(0) 노출하기 위해 초기화
        currentStep: 'DEPT_REWARD' // 뱃지 리워드 혹은 실패 피드백 팝업 단계로 이동
      };
    });
  }, []);

  // 4. 리워드 창 닫고 다음 학과로 진출하거나 최종 진단으로 전환
  const closeReward = useCallback(() => {
    setState(prev => {
      const dept = DEPARTMENTS[prev.currentDeptIndex];
      const nextDeptIndex = prev.currentDeptIndex + 1;
      
      // 맞춘 개수가 3개 이상인 경우에만 공식 뱃지 리스트에 등록 허용
      const newBadgeList = [...prev.badgeList];
      if (prev.correctCount >= 3 && !newBadgeList.includes(dept.id)) {
        newBadgeList.push(dept.id);
      }

      if (nextDeptIndex < DEPARTMENTS.length) {
        // 다음 과의 인트로 대화로 스위칭
        return {
          ...prev,
          currentStep: 'DEPT_INTRO',
          currentDeptIndex: nextDeptIndex,
          dialogueIndex: 0,
          correctCount: 0,
          badgeList: newBadgeList
        };
      } else {
        // 7개 과를 전부 완주한 경우 최종 리포트 결과 화면으로 전환
        return {
          ...prev,
          currentStep: 'RESULT',
          badgeList: newBadgeList
        };
      }
    });
  }, []);

  // 5. 첫 화면 리셋
  const resetGame = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    currentDept,
    currentDeptQuiz,
    introDialogues: INTRO_DIALOGUES,
    startGame,
    nextDialogue,
    submitAnswer,
    closeReward,
    resetGame,
  };
};
