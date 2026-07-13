import React, { useState, useEffect, useRef } from 'react';
import type { ColorToken } from '../../data/departments';
import { DEUMI_EXPRESSIONS, DEPARTMENTS } from '../../data/departments';
import { sound } from '../../utils/sound';

interface MessageBoxProps {
  characterName: string;
  characterImage: string;
  dialogueText: string;
  themeColor: ColorToken;
  onNext?: (isCorrect?: boolean) => void;
  choices?: string[]; // 미연시 대답 답변 선택지 또는 퀴즈 객관식 보기 리스트
  isCutscene?: boolean;

  // 💡 퀴즈 통합용 Props 추가
  isQuizMode?: boolean;
  quizType?: 'OX' | 'MULTIPLE';
  correctAnswer?: string;
  explanation?: string;
  deptId?: string;
}

export const MessageBox: React.FC<MessageBoxProps> = ({
  characterName,
  characterImage,
  dialogueText,
  themeColor,
  onNext,
  choices,
  isCutscene = false,
  isQuizMode = false,
  quizType = 'OX',
  correctAnswer = '',
  explanation = '',
  deptId,
}) => {
  // 💡 퀴즈 전용 내부 상태 선언
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const isNextCalledRef = useRef(false);

  // 퀴즈 5초 이하 진동 세기 계산
  const shakeIntensity = (isQuizMode && !isSubmitted && timeLeft <= 5) ? (6 - Math.max(1, Math.ceil(timeLeft))) : 0;

  // 📍 퀴즈용 10초 및 해설용 3초 타이머 루프 작동
  useEffect(() => {
    if (!isQuizMode) return;

    if (timeLeft <= 0) {
      if (isSubmitted) {
        triggerQuizNext(isCorrect);
      } else {
        handleTimeout();
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => Math.max(0, Number((prev - 0.05).toFixed(2))));
    }, 50);

    return () => clearTimeout(timer);
  }, [timeLeft, isSubmitted, isCorrect, isQuizMode]);

  // 퀴즈 문제 변경 시 상태 리셋
  useEffect(() => {
    if (isQuizMode) {
      setSelectedAnswer(null);
      setIsSubmitted(false);
      setIsCorrect(false);
      setTimeLeft(10);
      isNextCalledRef.current = false;
    }
  }, [dialogueText, isQuizMode]);

  // 다음 퀴즈 단계 이동 트리거
  const triggerQuizNext = (correctVal: boolean) => {
    if (isQuizMode) {
      if (isNextCalledRef.current) return;
      isNextCalledRef.current = true;
    }
    sound.playEffect('click');
    if (onNext) {
      onNext(correctVal);
    }
  };

  // 퀴즈 타임아웃
  const handleTimeout = () => {
    if (isSubmitted) return;
    setSelectedAnswer('');
    setIsCorrect(false);
    setIsSubmitted(true);
    sound.playEffect('incorrect');
    setTimeLeft(3);
  };

  // 퀴즈 보기 선택 처리
  const handleSelect = (answer: string) => {
    if (isSubmitted) return;
    setSelectedAnswer(answer);
    const correct = answer === correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);
    sound.playEffect(correct ? 'correct' : 'incorrect');
    setTimeLeft(3);
  };

  // 📍 퀴즈 결과 및 현재 상태에 따라 학과 캐릭터 표정 반환
  const getDynamicCharImage = () => {
    if (isQuizMode) {
      if (characterName === '듬이') {
        if (isSubmitted) {
          return isCorrect ? DEUMI_EXPRESSIONS.smile : DEUMI_EXPRESSIONS.worried;
        }
        return DEUMI_EXPRESSIONS.paint;
      }
      // 학과 고유 캐릭터 매칭
      const matchingDept = DEPARTMENTS.find(d => d.id === deptId && d.characterExpressions);
      if (matchingDept && matchingDept.characterExpressions) {
        if (isSubmitted) {
          return isCorrect ? matchingDept.characterExpressions.smile : matchingDept.characterExpressions.sad;
        }
      }
    }
    return characterImage;
  };

  // ⏰ 타이머 파이 차트 패스 계산식
  const getPiePath = () => {
    const maxTime = isSubmitted ? 3 : 10;
    const ratio = Math.min(1, Math.max(0, (maxTime - timeLeft) / maxTime));
    if (ratio <= 0.01) return '';
    if (ratio >= 0.99) {
      return 'M 64 64 M -64 0 a 64 64 0 1 0 128 0 a 64 64 0 1 0 -128 0';
    }
    const angle = ratio * 2 * Math.PI - Math.PI / 2;
    const x = 64 + 64 * Math.cos(angle);
    const y = 64 + 64 * Math.sin(angle);
    const largeArcFlag = ratio > 0.5 ? 1 : 0;
    return `M 64 64 L 64 0 A 64 64 0 ${largeArcFlag} 1 ${x} ${y} Z`;
  };

  // 퀴즈 머리말 격려 구어 획득
  const getPrefixMessage = () => {
    if (selectedAnswer === '') {
      switch (characterName) {
        case '듬이': return '🎨 아쉽지만 시간 초과야! 정답은 [' + correctAnswer + '] 이었어. ';
        case '냥이': return '🏥 시간 초과다구냥! 정답은 [' + correctAnswer + '] 이다냥. ';
        case '도기': return '🛠️ 시간 초과다! 정답은 [' + correctAnswer + '] 이다! ';
        case '버리': return '✈️ 시간 초과군! 정답은 [' + correctAnswer + '] 이었네. ';
        case '토리': return '⚡ 시간 초과다 칩! 정답은 [' + correctAnswer + '] 이다 칩! ';
        default: return '시간이 초과되었습니다! 정답은 [' + correctAnswer + '] 입니다. ';
      }
    }
    if (isCorrect) {
      switch (characterName) {
        case '듬이': return '🎨 맞아! 정답이야! ';
        case '냥이': return '🏥 맞구냥! 정답이다냥! ';
        case '도기': return '🛠️ 그렇지, 정답이다! ';
        case '버리': return '✈️ 정확해! 장학생감이군! ';
        case '토리': return '⚡ 맞아 칩! 딩동댕이다 칩! ';
        default: return '딩동댕! 정답입니다. ';
      }
    }
    switch (characterName) {
      case '듬이': return '🎨 아깝네, 오답이야! 정답은 [' + correctAnswer + '] 이었어. ';
      case '냥이': return '🏥 틀렸다냥! 정답은 [' + correctAnswer + '] 이다냥! ';
      case '도기': return '🛠️ 아쉽지만 오답이다! 정답은 [' + correctAnswer + '] 이다! ';
      case '버리': return '✈️ 틀렸군, 정답은 [' + correctAnswer + '] 이라네. ';
      case '토리': return '⚡ 아쉽다 칩! 정답은 [' + correctAnswer + '] 이다 칩! ';
      default: return '아쉽습니다, 오답입니다. 정답은 [' + correctAnswer + '] 입니다. ';
    }
  };

  // 퀴즈 옵션 버튼 동적 스타일 지정
  const getOptionStyle = (optionVal: string) => {
    if (!isSubmitted) return {
      borderColor: themeColor.primary,
      backgroundColor: '#ffffff',
      color: '#1e293b'
    };
    const isAnswer = optionVal === correctAnswer;
    const isUserChoice = optionVal === selectedAnswer;
    if (isAnswer) return {
      borderColor: '#10b981',
      backgroundColor: '#ecfdf4',
      color: '#065f46',
      borderWidth: '4px'
    };
    if (isUserChoice && !isCorrect) return {
      borderColor: '#ef4444',
      backgroundColor: '#fef2f2',
      color: '#991b1b',
      borderWidth: '4px'
    };
    return {
      borderColor: '#e2e8f0',
      backgroundColor: '#f8fafc',
      color: '#94a3b8',
      opacity: 0.5
    };
  };

  // OX 기호 색상 매칭
  const getOxCharColor = (option: 'O' | 'X') => {
    if (!isSubmitted) {
      return option === 'O' ? '#3b82f6' : '#ef4444';
    }
    const isAnswer = option === correctAnswer;
    const isUserChoice = option === selectedAnswer;
    if (isAnswer) return '#10b981';
    if (isUserChoice && !isCorrect) return '#ef4444';
    return '#cbd5e1';
  };

  const hasOptionsToRender = isQuizMode ? true : (choices && choices.length > 0);
  const cardMarginBottom = hasOptionsToRender ? '10px' : '0px';

  return (
    <div className={`message-box-container ${isQuizMode ? 'quiz-mode-container' : ''}`}>
      {isQuizMode && (!isSubmitted || selectedAnswer === '') && (
        <div 
          className={`analog-timer-widget ${shakeIntensity > 0 ? 'is-shaking' : ''}`}
          style={{ '--shake-intensity': shakeIntensity } as React.CSSProperties}
        >
          <svg width="100%" height="100%" viewBox="0 0 166 179" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
            <g id="Frame_99">
              <circle id="Ellipse_15" transform="translate(16 25)" cx="64" cy="64" r="64" fill="white" stroke={themeColor.primary} strokeWidth="20"/>
              {getPiePath() && (
                <path id="Pie_Timer_Gauge" transform="translate(16 25)" d={getPiePath()} fill={themeColor.primary} opacity="0.3"/>
              )}
              <circle id="Ellipse_19" transform="translate(16 25)" cx="64" cy="64" r="64" stroke={themeColor.primary} strokeWidth="20"/>
              <path id="Ellipse_16" transform="translate(0 20.5703) rotate(-40)" d="M32 16C32 13.8989 31.5861 11.8183 30.7821 9.87706C29.978 7.93586 28.7994 6.17203 27.3137 4.68629C25.828 3.20055 24.0641 2.022 22.1229 1.21793C20.1817 0.413852 18.1011 -9.18442e-08 16 0C13.8988 9.18442e-08 11.8183 0.413852 9.87706 1.21793C7.93585 2.022 6.17203 3.20055 4.68629 4.68629C3.20055 6.17203 2.022 7.93586 1.21793 9.87707C0.413852 11.8183 -1.83688e-07 13.8989 0 16L16 16H32Z" fill="white" stroke={themeColor.primary} strokeWidth="20" strokeLinejoin="round"/>
              <path id="Ellipse_17" transform="translate(134.57) rotate(40)" d="M32 16C32 13.8989 31.5861 11.8183 30.7821 9.87706C29.978 7.93586 28.7994 6.17203 27.3137 4.68629C25.828 3.20055 24.0641 2.022 22.1229 1.21793C20.1817 0.413852 18.1011 -9.18442e-08 16 0C13.8988 9.18442e-08 11.8183 0.413852 9.87706 1.21793C7.93585 2.022 6.17203 3.20055 4.68629 4.68629C3.20055 6.17203 2.022 7.93586 1.21793 9.87707C0.413852 11.8183 -1.83688e-07 13.8989 0 16L16 16H32Z" fill="white" stroke={themeColor.primary} strokeWidth="20" strokeLinejoin="round"/>
              <g id="Group_60" transform="translate(11.918 141)">
                <g id="Vector_193" transform="matrix(0.974304 -0.225236 0.296596 0.955003 0 5.07031)">
                  <path d="M22.5103 0L0 19.8136" stroke={themeColor.primary} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <g id="Vector_194" transform="matrix(-0.974304 -0.225236 -0.296596 0.955003 135.66 5.07031)">
                  <path d="M22.5103 0L0 19.8136" stroke={themeColor.primary} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </g>
              <text x="80" y="93" textAnchor="middle" dominantBaseline="middle" fill={selectedAnswer === '' ? '#ef4444' : (Math.ceil(timeLeft) <= 3 ? '#ef4444' : themeColor.primary)} style={{ fontFamily: 'var(--font-mitmi), sans-serif', fontSize: '56px' }}>
                {selectedAnswer === '' ? '✔' : Math.ceil(timeLeft)}
              </text>
            </g>
          </svg>
        </div>
      )}

      {!isCutscene && (
        <div 
          className={`char-illust-wrapper ${isQuizMode && isSubmitted ? (isCorrect ? 'react-correct' : 'react-incorrect') : ''}`}
          style={{ 
            transform: (characterName === '토리' || characterName === '냥이') ? 'translateY(-40px)' : undefined,
            transition: 'transform 0.2s ease-out',
            marginBottom: '-105px'
          }}
        >
          <img 
            src={getDynamicCharImage()} 
            alt={characterName} 
            className="char-illust" 
            draggable={false}
          />
        </div>
      )}

      <div 
        className={`dialogue-card ${isCutscene ? 'cutscene-dialogue-card' : ''}`}
        onClick={(isCutscene && onNext) ? () => triggerQuizNext(false) : (isQuizMode && isSubmitted) ? () => triggerQuizNext(isCorrect) : undefined}
        style={{
          borderColor: themeColor.primary,
          boxShadow: `0 8px 0 ${themeColor.shadow}`,
          backgroundColor: themeColor.light,
          cursor: (isCutscene || (isQuizMode && isSubmitted)) ? 'pointer' : 'default',
          marginBottom: cardMarginBottom,
        }}
      >
        <div 
          className="char-name-badge"
          style={{
            backgroundColor: themeColor.primary,
            borderColor: themeColor.primary,
            boxShadow: `0 3px 0 ${themeColor.shadow}`,
          }}
        >
          {isQuizMode 
            ? (isSubmitted ? (selectedAnswer === '' ? 'TIMEOUT' : 'EXPLANATION') : 'QUESTION')
            : characterName
          }
        </div>

        <div className="dialogue-text">
          {isQuizMode 
            ? (isSubmitted ? `${getPrefixMessage()} ${explanation}` : dialogueText)
            : dialogueText
          }
        </div>

        {isCutscene && (
          <div className="cutscene-touch-guide" style={{ color: themeColor.primary }}>
            터치하여 다음으로 넘어가기 <span className="blink-dot">●</span>
          </div>
        )}
        {isQuizMode && isSubmitted && (
          <div className="cutscene-touch-guide" style={{ color: themeColor.primary }}>
            터치하여 다음으로 넘어가기 <span className="blink-dot">●</span>
          </div>
        )}
      </div>

      {isQuizMode ? (
        <div className="quiz-answers-panel" style={{ marginTop: '0px' }}>
          {quizType === 'OX' ? (
            <div className="ox-horizontal-row">
              <button
                className="ox-block-btn"
                onClick={isSubmitted ? () => triggerQuizNext(isCorrect) : () => handleSelect('O')}
                style={{
                  ...getOptionStyle('O'),
                  boxShadow: selectedAnswer === 'O' 
                    ? `0 2px 0 ${isSubmitted ? (correctAnswer === 'O' ? '#047857' : '#b91c1c') : themeColor.shadow}` 
                    : `0 6px 0 ${isSubmitted ? (correctAnswer === 'O' ? '#047857' : (selectedAnswer === 'O' ? '#b91c1c' : '#cbd5e1')) : themeColor.shadow}`,
                  transform: selectedAnswer === 'O' ? 'translateY(4px)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <span className="ox-symbol-char" style={{ color: getOxCharColor('O') }}>O</span>
                <span className="ox-symbol-desc">그렇다</span>
              </button>

              <button
                className="ox-block-btn"
                onClick={isSubmitted ? () => triggerQuizNext(isCorrect) : () => handleSelect('X')}
                style={{
                  ...getOptionStyle('X'),
                  boxShadow: selectedAnswer === 'X' 
                    ? `0 2px 0 ${isSubmitted ? (correctAnswer === 'X' ? '#047857' : '#b91c1c') : themeColor.shadow}` 
                    : `0 6px 0 ${isSubmitted ? (correctAnswer === 'X' ? '#047857' : (selectedAnswer === 'X' ? '#b91c1c' : '#cbd5e1')) : themeColor.shadow}`,
                  transform: selectedAnswer === 'X' ? 'translateY(4px)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <span className="ox-symbol-char" style={{ color: getOxCharColor('X') }}>X</span>
                <span className="ox-symbol-desc">아니다</span>
              </button>
            </div>
          ) : (
            <div className="multiple-grid-layout">
              {choices?.map((opt, i) => {
                const optStyle = getOptionStyle(opt);
                const isSelected = selectedAnswer === opt;
                const isAnswer = opt === correctAnswer;
                const currentShadowColor = isSubmitted 
                  ? (isAnswer ? '#047857' : (isSelected ? '#b91c1c' : '#cbd5e1'))
                  : themeColor.shadow;

                return (
                  <button
                    key={i}
                    className="multiple-row-btn"
                    onClick={isSubmitted ? () => triggerQuizNext(isCorrect) : () => handleSelect(opt)}
                    style={{
                      ...optStyle,
                      boxShadow: isSelected ? `0 2px 0 ${currentShadowColor}` : `0 5px 0 ${currentShadowColor}`,
                      transform: isSelected ? 'translateY(3px)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span className="row-badge-num">{i + 1}</span>
                    <span className="row-badge-text">{opt}</span>
                    {isSubmitted && (
                      <span className="option-ox-indicator" style={{ color: isAnswer ? '#10b981' : '#ef4444' }}>
                        {isAnswer ? 'O' : (isSelected ? 'X' : '')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        onNext && (choices && choices.length > 0 || !isCutscene) && (
          <div className="choices-buttons-container">
            {choices && choices.length > 0 ? (
              choices.map((choiceText, index) => (
                <button
                  key={index}
                  className="choice-bar-btn"
                  onClick={() => triggerQuizNext(false)}
                  style={{
                    borderColor: themeColor.primary,
                    boxShadow: `0 5px 0 ${themeColor.shadow}`,
                    backgroundColor: '#ffffff',
                    '--shadow-color': themeColor.shadow
                  } as React.CSSProperties}
                >
                  <span className="choice-bullet" style={{ color: themeColor.primary }}>✦</span>
                  <span className="choice-btn-text">{choiceText}</span>
                </button>
              ))
            ) : (
              <button 
                className="choice-bar-btn default-next-btn"
                onClick={() => triggerQuizNext(false)}
                style={{
                  borderColor: themeColor.primary,
                  boxShadow: `0 5px 0 ${themeColor.shadow}`,
                  backgroundColor: themeColor.primary,
                  color: '#ffffff',
                  '--shadow-color': themeColor.shadow
                } as React.CSSProperties}
              >
                다음 이야기 ▶
              </button>
            )}
          </div>
        )
      )}

      <style>{`
        .message-box-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0px;
          margin-top: auto;
          margin-bottom: 0px;
          padding: 0 8px 12px 8px;
          box-sizing: border-box;
          animation: fadeIn 0.6s ease-out both;
        }

        /* 💡 퀴즈 모드일 때 화면 전체를 투명하게 채워 타이머 절대배치 기준점을 최상단으로 확보 */
        .quiz-mode-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          height: 100% !important;
          margin-top: 0 !important;
          padding: 0px 8px 12px 8px !important;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: stretch;
        }

        /* 퀴즈 모드 내부의 자식 카드들은 클릭이 되어야 하므로 pointer-events 복원 */
        .quiz-mode-container .analog-timer-widget,
        .quiz-mode-container .char-illust-wrapper,
        .quiz-mode-container .dialogue-card,
        .quiz-mode-container .quiz-answers-panel {
          pointer-events: auto;
        }

        .cutscene-touch-guide {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
          font-size: 11px;
          margin-top: 10px;
          opacity: 0.65;
          user-select: none;
        }

        .blink-dot {
          animation: guideBlink 1.2s infinite ease-in-out;
        }

        @keyframes guideBlink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }

        .cutscene-dialogue-card {
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .cutscene-dialogue-card:active {
          transform: translateY(4px);
          box-shadow: 0 4px 0 ${themeColor.shadow} !important;
        }

        .char-illust-wrapper.react-correct .char-illust {
          animation: charJump 0.6s ease-out infinite;
          filter: drop-shadow(0 0 25px rgba(16, 185, 129, 0.6)) drop-shadow(0 8px 12px rgba(0,0,0,0.22));
        }
        @keyframes charJump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .char-illust-wrapper.react-incorrect .char-illust {
          animation: charShiver 0.15s infinite linear;
          filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.48)) drop-shadow(0 8px 12px rgba(0,0,0,0.22));
        }
        @keyframes charShiver {
          0%, 100% { transform: translateX(0); }
          33% { transform: translateX(-1.5px); }
          66% { transform: translateX(1.5px); }
        }

        .char-illust-wrapper {
          height: 300px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 4;
        }

        .char-illust {
          height: 100%;
          max-height: 300px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.28));
        }

        .dialogue-card {
          position: relative;
          width: 100%;
          min-height: 120px;
          border: 4px solid;
          border-radius: 20px;
          padding: 26px 20px 20px 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 5;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .char-name-badge {
          position: absolute;
          top: -18px;
          left: 20px;
          padding: 6px 18px;
          border-radius: 12px;
          border: 2px solid;
          color: #ffffff;
          font-size: 16px;
          font-weight: normal;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .dialogue-text {
          font-size: 19px;
          line-height: 1.5;
          color: #1e293b;
          white-space: pre-wrap;
          font-weight: normal;
        }

        /* ⏰ 타이머 아날로그 시계 스타일 */
        .analog-timer-widget {
          position: absolute;
          top: 14px;
          left: 16px;
          width: 52px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99;
          filter: drop-shadow(0 3px 0 ${themeColor.shadow});
          transition: filter 0.3s ease;
        }

        .analog-timer-widget.is-shaking {
          animation: timerShake 0.12s infinite linear;
        }

        @keyframes timerShake {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(calc(var(--shake-intensity) * -0.15px), calc(var(--shake-intensity) * 0.15px)) rotate(calc(var(--shake-intensity) * -0.06deg)); }
          50% { transform: translate(calc(var(--shake-intensity) * 0.15px), calc(var(--shake-intensity) * -0.15px)) rotate(calc(var(--shake-intensity) * 0.06deg)); }
          75% { transform: translate(calc(var(--shake-intensity) * -0.15px), calc(var(--shake-intensity) * -0.15px)) rotate(calc(var(--shake-intensity) * -0.02deg)); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        .choices-buttons-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 6;
          padding: 0 4px;
        }

        .choice-bar-btn {
          width: 100%;
          padding: 12px 20px;
          border: 3px solid;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mitmi);
          font-size: 18px;
          font-weight: normal;
          text-align: left;
          cursor: pointer;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .choice-bar-btn:active {
          transform: translateY(3px);
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.35) !important; /* 깨지지 않는 부드러운 검정색 섀도로 고정 */
        }

        .choice-bullet {
          font-size: 16px;
          line-height: 1;
        }

        .choice-btn-text {
          color: #334155;
        }
        
        .default-next-btn .choice-btn-text {
          color: #ffffff;
        }

        /* ─── OX 퀴즈 버튼 레이아웃 ─── */
        .ox-horizontal-row {
          width: 100%;
          display: flex;
          flex-direction: row;
          gap: 10px;
        }

        .ox-block-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 14px 8px;
          border: 3px solid rgba(255, 255, 255, 0.6);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.92);
          cursor: pointer;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
          font-family: var(--font-mitmi);
        }

        .ox-block-btn:active {
          transform: translateY(4px) !important;
        }

        .ox-symbol-char {
          font-size: 36px;
          font-weight: bold;
          line-height: 1;
        }

        .ox-symbol-desc {
          font-size: 14px;
          color: #475569;
          font-family: var(--font-mitmi);
        }

        /* ─── 퀴즈 답변 패널 공통 ─── */
        .quiz-answers-panel {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0;
          box-sizing: border-box;
        }

        /* ─── 4지선다 그리드 ─── */
        .multiple-grid-layout {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .multiple-row-btn {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border: 3px solid rgba(255, 255, 255, 0.6);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.92);
          cursor: pointer;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
          font-family: var(--font-mitmi);
          text-align: left;
          box-sizing: border-box;
        }

        .multiple-row-btn:active {
          transform: translateY(3px) !important;
        }

        .row-badge-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #475569;
          font-size: 13px;
          font-weight: bold;
          flex-shrink: 0;
        }

        .row-badge-text {
          flex: 1;
          font-size: 15px;
          color: #1e293b;
          line-height: 1.35;
        }

        .option-ox-indicator {
          font-size: 18px;
          font-weight: bold;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};
