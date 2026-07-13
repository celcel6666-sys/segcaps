import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { MessageBox } from './components/common/MessageBox';
import { BadgeReward } from './components/common/BadgeReward';
import { ResultScreen } from './components/ResultScreen';
import { COMMON_ASSETS, DEUMI_EXPRESSIONS, DEPARTMENTS, MEDIA_CUTSCENES, AVIONICS_CUTSCENES, ARCH_CUTSCENES } from './data/departments';
import { sound } from './utils/sound';
import './App.css';

// 에셋 임포트
import openingBg from './assets/opening_bg.jpg';
import openingLogo from './assets/opening_logo.png';

function App() {
  const {
    state,
    currentDept,
    currentDeptQuiz,
    introDialogues,
    startGame,
    nextDialogue,
    submitAnswer,
    closeReward,
    resetGame,
  } = useGameState();

  const [isLogoPressed, setIsLogoPressed] = useState(false);
  // 📸 고해상도 배경 이미지와 캐릭터 일러스트를 선제적 프리로딩
  useEffect(() => {
    const imagesToPreload = [
      openingBg,
      COMMON_ASSETS.schoolGateBg,
      COMMON_ASSETS.schoolCampusBg,
      ...DEPARTMENTS.map(d => d.bgImage),
      ...Object.values(DEUMI_EXPRESSIONS),
      ...DEPARTMENTS.map(d => d.characterImage),
      ...DEPARTMENTS.flatMap(d => d.characterExpressions ? Object.values(d.characterExpressions) : []),
    ];

    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // 🎬 실패 시 아웃트로 대사가 종료되었음을 감지하여 즉시 다음 학과 진입 또는 결과화면으로 전환
  useEffect(() => {
    if (state.currentStep === 'DEPT_REWARD') {
      const outroTexts = state.isLastQuizCorrect
        ? currentDeptQuiz.outroDialogueSuccess
        : currentDeptQuiz.outroDialogueFail;
        
      if (state.dialogueIndex >= outroTexts.length) {
        if (!state.isLastQuizCorrect) {
          closeReward();
        }
      }
    }
  }, [state.currentStep, state.dialogueIndex, state.isLastQuizCorrect, currentDept.id, currentDeptQuiz, closeReward]);

  // 🎬 현재 활성화된 씬이 미디어과 컷씬 모드인지 체크하는 헬퍼
  const isCurrentCutscene = () => {
    if (state.currentStep === 'DEPT_INTRO') {
      const dialogue = currentDeptQuiz.introDialogue[state.dialogueIndex];
      return !!(dialogue && dialogue.isCutscene);
    }
    if (state.currentStep === 'DEPT_REWARD') {
      const outroTexts = state.isLastQuizCorrect
        ? currentDeptQuiz.outroDialogueSuccess
        : currentDeptQuiz.outroDialogueFail;
      const dialogue = outroTexts[state.dialogueIndex];
      return !!(dialogue && dialogue.isCutscene);
    }
    return false;
  };

  // 현재 활성화된 단계에 따른 배경 이미지 매핑
  const getActiveBg = () => {
    // 🎬 컷씬 노출 단계인 경우, 뒷배경을 해당 컷씬 이미지로 꽉 채움
    if (state.currentStep === 'DEPT_INTRO') {
      const dialogue = currentDeptQuiz.introDialogue[state.dialogueIndex];
      if (dialogue && dialogue.isCutscene && dialogue.cutsceneImage) {
        // 학과별 컷씬 맵 선택
        const cutsceneMap = currentDept.id === 'AVIONICS' ? AVIONICS_CUTSCENES
          : currentDept.id === 'ARCHITECTURE' ? ARCH_CUTSCENES
          : MEDIA_CUTSCENES;
        return cutsceneMap[dialogue.cutsceneImage] || currentDept.bgImage;
      }
    }
    if (state.currentStep === 'DEPT_REWARD') {
      const outroTexts = state.isLastQuizCorrect
        ? currentDeptQuiz.outroDialogueSuccess
        : currentDeptQuiz.outroDialogueFail;
      const dialogue = outroTexts[state.dialogueIndex];
      if (dialogue && dialogue.isCutscene && dialogue.cutsceneImage) {
        const cutsceneMap = currentDept.id === 'AVIONICS' ? AVIONICS_CUTSCENES
          : currentDept.id === 'ARCHITECTURE' ? ARCH_CUTSCENES
          : MEDIA_CUTSCENES;
        return cutsceneMap[dialogue.cutsceneImage] || currentDept.bgImage;
      }
    }

    switch (state.currentStep) {
      case 'TITLE':
        return openingBg;
      case 'INTRO_STORY':
        return COMMON_ASSETS.schoolGateBg;
      case 'DEPT_INTRO':
      case 'DEPT_QUIZ':
      case 'DEPT_REWARD':
        return currentDept.bgImage;
      case 'RESULT':
        return COMMON_ASSETS.schoolCampusBg;
      default:
        return openingBg;
    }
  };

  // 듬이 인트로 표정 매핑 헬퍼
  const getDeumiIntroImage = () => {
    const expression = introDialogues[state.dialogueIndex]?.expression || 'default';
    return DEUMI_EXPRESSIONS[expression] || DEUMI_EXPRESSIONS.default;
  };

  // 개별학과 인트로 듬이 외의 캐릭터 동적 이미지
  const getDeptCharImage = () => {
    let dialogue = null;
    if (state.currentStep === 'DEPT_REWARD') {
      const outroTexts = state.isLastQuizCorrect
        ? currentDeptQuiz.outroDialogueSuccess
        : currentDeptQuiz.outroDialogueFail;
      dialogue = outroTexts[state.dialogueIndex];
    } else {
      dialogue = currentDeptQuiz.introDialogue[state.dialogueIndex];
    }

    if (dialogue && currentDept.characterExpressions) {
      const expr = dialogue.expression;
      if (expr === 'smile') return currentDept.characterExpressions.smile;
      if (expr === 'sad') return currentDept.characterExpressions.sad;
      if (expr === 'angry' && currentDept.characterExpressions.angry) return currentDept.characterExpressions.angry;
      if (expr === 'worried' && currentDept.characterExpressions.worried) return currentDept.characterExpressions.worried;
    }
    return currentDept.characterImage;
  };

  // 타이틀 스크린 터치 시 BGM 트리거
  const handleTitleClick = () => {
    sound.playBGM();
  };

  // 로고 눌림 효과: 누르는 순간 축소, 떼는 순간 즉시 원상복구
  const handleLogoPointerDown = () => setIsLogoPressed(true);
  const handleLogoPointerUp = () => setIsLogoPressed(false);
  const handleLogoPointerLeave = () => setIsLogoPressed(false);

  // 공통 대사 진행 (MessageBox 내부에서 click 효과음이 1회 자동 재생되므로 부모 중복 호출 제거)
  const handleNextDialogue = () => {
    nextDialogue();
  };



  return (
    <div className="app-container">
      {/* 1. 고해상도 백그라운드 레이어 */}
      <img 
        src={getActiveBg()} 
        alt="게임 배경" 
        className={`opening-bg ${state.currentStep !== 'TITLE' && !isCurrentCutscene() ? 'ingame-bg-dimmed' : ''}`} 
        draggable={false} 
      />
      
      {/* 2. 조도 보정용 오버레이 */}
      <div className="opening-overlay"></div>

      {/* 3. 모바일 중앙 영역 정렬 컨테이너 */}
      <div className="content-wrapper layout-option-A">
        
        {/* ================= (1) 타이틀/오프닝 화면 ================= */}
        {state.currentStep === 'TITLE' && (
          <div className="opening-screen" onClick={handleTitleClick}>
            
            <div
              className={`opening-header ${isLogoPressed ? 'logo-pressed' : ''}`}
              onPointerDown={handleLogoPointerDown}
              onPointerUp={handleLogoPointerUp}
              onPointerLeave={handleLogoPointerLeave}
            >
              <img src={openingLogo} alt="내 학과는 어디?" className="opening-logo" draggable={false} />
            </div>

            <div className="opening-footer">
              <button 
                className="start-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playEffect('click');
                  sound.playBGM();
                  startGame();
                }}
              >
                <div className="btn-bg"></div>
                <span className="btn-text">분석 시작하기</span>
              </button>
              <p className="helper-text">화면을 눌러 나의 학과를 찾아보세요</p>
            </div>
          </div>
        )}

        {/* ================= (2) 공통 스토리 인트로 ================= */}
        {state.currentStep === 'INTRO_STORY' && (
          <div className="game-stage-container">
            <div className="stage-hud">
              <span className="hud-badge">세경고 입구</span>
            </div>
            <MessageBox
              characterName="듬이"
              characterImage={getDeumiIntroImage()}
              dialogueText={introDialogues[state.dialogueIndex].text}
              themeColor={{
                primary: '#3b82f6',
                shadow: '#1d4ed8',
                hover: '#60a5fa',
                light: '#eff6ff'
              }}
              onNext={handleNextDialogue}
              choices={introDialogues[state.dialogueIndex].choices}
              isCutscene={(introDialogues[state.dialogueIndex] as any).isCutscene}
            />
          </div>
        )}

        {/* ================= (3) 개별 학과 인트로 대화 ================= */}
        {state.currentStep === 'DEPT_INTRO' && (
          <div className="game-stage-container">
            <div className="stage-hud" style={{ color: currentDept.color.primary }}>
              <span 
                className="hud-badge" 
                style={{ backgroundColor: currentDept.color.primary }}
              >
                {state.currentDeptIndex + 1} / 7 과 : {currentDept.name}
              </span>
            </div>
            <MessageBox
              characterName={currentDept.characterName}
              characterImage={getDeptCharImage()}
              dialogueText={currentDeptQuiz.introDialogue[state.dialogueIndex].text}
              themeColor={currentDept.color}
              onNext={handleNextDialogue}
              choices={currentDeptQuiz.introDialogue[state.dialogueIndex].choices}
              isCutscene={currentDeptQuiz.introDialogue[state.dialogueIndex].isCutscene}
            />
          </div>
        )}

        {/* ================= (4) 개별 학과 퀴즈 풀기 ================= */}
        {state.currentStep === 'DEPT_QUIZ' && (() => {
          const quiz = currentDeptQuiz.quizzes[state.currentQuizIndex];
          return (
            <div className="game-stage-container quiz-stage-layout">
              <div className="stage-hud">
                <span 
                  className="hud-badge" 
                  style={{ backgroundColor: currentDept.color.primary }}
                >
                  {currentDept.name} 퀴즈 ({state.currentQuizIndex + 1} / {currentDeptQuiz.quizzes.length})
                </span>
              </div>

              <MessageBox
                key={`${currentDept.id}_Q${state.currentQuizIndex}`}
                characterName={currentDept.characterName}
                characterImage={currentDept.id === 'MEDIA' ? DEUMI_EXPRESSIONS.paint : currentDept.characterImage}
                dialogueText={quiz.question}
                themeColor={currentDept.color}
                onNext={(isCorrect) => {
                  submitAnswer(!!isCorrect);
                }}
                choices={quiz.options}
                isQuizMode={true}
                quizType={quiz.type}
                correctAnswer={quiz.correctAnswer}
                explanation={quiz.explanation}
                deptId={currentDept.id}
              />
            </div>
          );
        })()}

        {/* ================= (5) 퀴즈 뱃지 리워드 / 실패 피드백 팝업 ================= */}
        {state.currentStep === 'DEPT_REWARD' && (() => {
          const outroTexts = state.isLastQuizCorrect
            ? currentDeptQuiz.outroDialogueSuccess
            : currentDeptQuiz.outroDialogueFail;
            
          const isOutroActive = state.dialogueIndex < outroTexts.length;

          if (isOutroActive) {
            const currentOutro = outroTexts[state.dialogueIndex];
            return (
              <div className="game-stage-container">
                <div className="stage-hud" style={{ color: currentDept.color.primary }}>
                  <span 
                    className="hud-badge" 
                    style={{ backgroundColor: state.isLastQuizCorrect ? currentDept.color.primary : '#ef4444' }}
                  >
                    {state.isLastQuizCorrect ? '미션 통과' : '미션 보완 필요'}
                  </span>
                </div>
                <MessageBox
                  characterName={currentDept.characterName}
                  characterImage={getDeptCharImage()}
                  dialogueText={currentOutro.text}
                  themeColor={currentDept.color}
                  onNext={handleNextDialogue}
                  choices={currentOutro.choices}
                  isCutscene={currentOutro.isCutscene}
                />
              </div>
            );
          } else if (state.isLastQuizCorrect) {
            return (
              <BadgeReward
                badgeName={currentDept.badgeName}
                badgeIcon={currentDept.badgeIcon}
                themeColor={currentDept.color}
                onClose={() => {
                  sound.playEffect('click');
                  closeReward();
                }}
              />
            );
          }
          return null;
        })()}

        {/* ================= (6) 최종 진단 결과 리포트 ================= */}
        {state.currentStep === 'RESULT' && (
          <ResultScreen
            scores={state.scores}
            badgeList={state.badgeList}
            onReset={() => {
              sound.playEffect('click');
              // BGM 정지 후 재시작
              sound.stopBGM();
              resetGame();
            }}
          />
        )}

      </div>
    </div>
  );
}

export default App;
