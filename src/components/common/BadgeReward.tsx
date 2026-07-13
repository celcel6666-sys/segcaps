import React, { useEffect } from 'react';
import type { ColorToken } from '../../data/departments';

interface BadgeRewardProps {
  badgeName: string;
  badgeIcon: string; // 각 학과별 고유 뱃지 이모지 수신
  themeColor: ColorToken;
  onClose: () => void;
}

export const BadgeReward: React.FC<BadgeRewardProps> = ({
  badgeName,
  badgeIcon,
  themeColor,
  onClose,
}) => {
  useEffect(() => {
    // 확인 버튼을 눌러 넘어가도록 설정
  }, []);

  return (
    <div className="badge-reward-overlay">
      <div 
        className="badge-reward-card"
        style={{
          borderColor: themeColor.primary,
          boxShadow: `0 12px 0 ${themeColor.shadow}`,
          backgroundColor: themeColor.light,
        }}
      >
        {/* 축하 타이틀 (볼드 해제) */}
        <h2 className="reward-title" style={{ color: themeColor.primary }}>
          {badgeIcon} 뱃지 획득 성공!
        </h2>
        
        <p className="reward-subtitle">
          미션을 멋지게 통과하여 전공 뱃지를 모았습니다!
        </p>

        {/* 뱃지 아이콘 애니메이션 공간 */}
        <div className="badge-orbit-wrapper">
          <div className="sparkle-effect"></div>
          <div 
            className="badge-3d-sphere"
            style={{
              backgroundColor: themeColor.primary,
              boxShadow: `inset -6px -6px 12px ${themeColor.shadow}, 
                          0 8px 24px rgba(0,0,0,0.3)`
            }}
          >
            <span className="badge-emoji">{badgeIcon}</span>
          </div>
        </div>

        {/* 뱃지 이름 (볼드 해제) */}
        <div 
          className="badge-name-tag"
          style={{
            borderColor: themeColor.primary,
            color: themeColor.primary
          }}
        >
          {badgeName}
        </div>

        {/* 닫기/확인 버튼 (볼드 해제) */}
        <button
          className="reward-confirm-btn"
          onClick={onClose}
          style={{
            backgroundColor: themeColor.primary,
            borderColor: themeColor.primary,
            boxShadow: `0 6px 0 ${themeColor.shadow}`,
          }}
        >
          다음 과로 가기
        </button>
      </div>

      <style>{`
        .badge-reward-overlay {
          position: fixed; /* position: absolute 대신 fixed를 써서 가로 확대 시에도 브라우저 전체 화면을 어둡게 차단 */
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(15, 23, 42, 0.85); /* 짙은 투명 장막 */
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .badge-reward-card {
          width: 100%;
          max-width: 380px;
          border: 5px solid;
          border-radius: 28px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }

        .reward-title {
          font-family: var(--font-mitmi);
          font-size: 28px;
          font-weight: normal; /* 볼드 해제로 글꼴 번짐 현상 복구 */
          margin-bottom: 8px;
        }

        .reward-subtitle {
          font-size: 15px;
          color: #475569;
          line-height: 1.4;
          margin-bottom: 24px;
        }

        /* 3D 뱃지 회전 궤도 */
        .badge-orbit-wrapper {
          position: relative;
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .badge-3d-sphere {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: spinBadge 4s linear infinite;
          z-index: 2;
        }

        .badge-emoji {
          font-size: 48px;
          animation: scalePulse 2s infinite ease-in-out;
        }

        /* 뱃지 후면 불꽃 스파클 효과 */
        .sparkle-effect {
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(253,224,71,0.5) 0%, rgba(253,224,71,0) 70%);
          animation: pulseSparkle 2s infinite ease-in-out;
          z-index: 1;
        }

        .badge-name-tag {
          padding: 8px 24px;
          border: 3px solid;
          border-radius: 50px;
          background-color: #ffffff;
          font-family: var(--font-mitmi);
          font-size: 18px;
          font-weight: normal; /* 볼드 해제 */
          margin-bottom: 32px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }

        .reward-confirm-btn {
          width: 100%;
          max-width: 200px;
          padding: 12px 24px;
          border-radius: 20px;
          border: 3px solid;
          color: #ffffff;
          font-family: var(--font-mitmi);
          font-size: 20px;
          font-weight: normal; /* 볼드 해제 */
          cursor: pointer;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .reward-confirm-btn:active {
          transform: translateY(4px);
          box-shadow: 0 2px 0 currentColor !important;
        }

        /* 애니메이션 선언 */
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes spinBadge {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes scalePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes pulseSparkle {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.25); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};
