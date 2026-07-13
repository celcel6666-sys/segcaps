import React, { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { DEPARTMENTS, DEUMI_EXPRESSIONS } from '@/data/departments';
import type { Department } from '@data/departments';

interface ResultScreenProps {
  scores: Record<string, number>;
  badgeList: string[];
  onReset: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  scores,
  badgeList,
  onReset,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // 성향 라벨 및 점수 데이터
  const radarLabels = [
    { name: '🎨 예술성', key: 'artistic' },
    { name: '💉 배려심', key: 'caring' },
    { name: '🧮 논리력', key: 'logical' },
    { name: '📐 공간지각', key: 'spatial' },
    { name: '🛠️ 기술성', key: 'technical' },
    { name: '✈️ 정밀성', key: 'precision' },
    { name: '🪖 책임성', key: 'responsibility' },
  ];

  // 1. 가장 높은 점수의 학과 진단
  let recommendedDept: Department = DEPARTMENTS[0];
  let maxScore = -1;

  DEPARTMENTS.forEach(dept => {
    const score = scores[dept.scoreKey] || 0;
    if (score > maxScore) {
      maxScore = score;
      recommendedDept = dept;
    }
  });

  const isSharedEntry = window.location.search.includes('result');

  // 캐릭터 표정 해맑은 버전으로 반환 (듬이는 smile, 그 외 학과는 고유 캐릭터)
  const getResultCharacterImage = () => {
    if (recommendedDept.id === 'MEDIA') {
      return DEUMI_EXPRESSIONS.smile;
    }
    return recommendedDept.characterImage;
  };

  // 2. HTML5 Canvas 레이더 차트 드로잉 (DPI 스케일 및 최대 30점 스케일 보정 완료)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = 340;
    const logicalHeight = 260;

    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr); 

    const centerX = logicalWidth / 2;
    const centerY = logicalHeight / 2;
    const radius = Math.min(logicalWidth, logicalHeight) * 0.26; 
    const totalSides = radarLabels.length;

    // (1) 배경 다각형 가이드라인 그리기 (3단계 레벨 라인)
    const levels = 3;
    for (let j = 1; j <= levels; j++) {
      const levelRadius = radius * (j / levels);
      ctx.beginPath();
      for (let i = 0; i < totalSides; i++) {
        const angle = (i * 2 * Math.PI) / totalSides - Math.PI / 2;
        const x = centerX + levelRadius * Math.cos(angle);
        const y = centerY + levelRadius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      ctx.fillStyle = j % 2 === 0 ? 'rgba(241, 245, 249, 0.2)' : 'rgba(255, 255, 255, 0)';
      ctx.fill();
    }

    // (2) 축 선(Axis lines) 그리기
    ctx.beginPath();
    for (let i = 0; i < totalSides; i++) {
      const angle = (i * 2 * Math.PI) / totalSides - Math.PI / 2;
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
    }
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.stroke();

    // (3) 실제 유저 점수 다각형 그리기 (만점 100점 기준 배점 스케일)
    ctx.beginPath();
    const dataPoints: { x: number; y: number }[] = [];
    radarLabels.forEach((label, i) => {
      const score = scores[label.key] || 0;
      const ratio = Math.max(0.08, Math.min(100, score)) / 100; // 분모를 100점(배점 합산 만점)으로 설정
      const angle = (i * 2 * Math.PI) / totalSides - Math.PI / 2;
      const x = centerX + radius * ratio * Math.cos(angle);
      const y = centerY + radius * ratio * Math.sin(angle);
      dataPoints.push({ x, y });
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    ctx.fillStyle = `${recommendedDept.color.primary}33`; 
    ctx.fill();
    ctx.strokeStyle = recommendedDept.color.primary;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // 데이터 교차점 둥근 원 그리기
    dataPoints.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = recommendedDept.color.primary;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // (4) 텍스트 라벨 배치
    ctx.font = 'bold 12px OngeulipMitmi, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    radarLabels.forEach((label, i) => {
      const angle = (i * 2 * Math.PI) / totalSides - Math.PI / 2;
      const textX = centerX + (radius + 20) * Math.cos(angle);
      const textY = centerY + (radius + 12) * Math.sin(angle);

      if (Math.cos(angle) > 0.1) ctx.textAlign = 'left';
      else if (Math.cos(angle) < -0.1) ctx.textAlign = 'right';
      else ctx.textAlign = 'center';

      ctx.fillText(label.name, textX, textY);
    });
  }, [scores, recommendedDept]);

  // html2canvas 기반 결과 카드 고화질 PNG 캡처 다운로드 (엽서 전체 영역 복제)
  const handleDownloadCard = async () => {
    const cardWrapperEl = cardRef.current;
    if (!cardWrapperEl) return;
    try {
      const canvas = await html2canvas(cardWrapperEl, {
        useCORS: true,
        scale: 2, 
        backgroundColor: null, 
        logging: false,
        scrollY: -window.scrollY
      });
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `segyeong_postcard_${recommendedDept.id}.png`;
      downloadLink.href = dataUrl;
      downloadLink.click();
    } catch (err) {
      console.error('카드 이미지 저장 오류:', err);
      alert('카드 다운로드에 실패했습니다. 최신 브라우저를 이용해주세요.');
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?result=${recommendedDept.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('학과 진단 분석 카드가 복사되었습니다! 친구들에게 추천해 보세요! 🔗');
      }).catch(() => {
        fallbackCopy(shareUrl);
      });
    } else {
      fallbackCopy(shareUrl);
    }
  };

  const fallbackCopy = (text: string) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      alert('학과 진단 분석 카드가 복사되었습니다! 친구들에게 추천해 보세요! 🔗');
    } catch (e) {
      alert('공유 링크: ' + text);
    }
    document.body.removeChild(tempInput);
  };

  const handleGoToTest = () => {
    window.location.href = window.location.origin + window.location.pathname;
  };

  return (
    <div className="result-screen-container">
      {/* 듬이 엔딩 축하 말풍선 */}
      <div className="result-intro-speech">
        🏆 모든 학과 탐험 완료! 수고 많았어 친구! 네 강점을 가득 담은 진단서가 발급되었어.
      </div>

      {/* 최종 추천 학과 카드 래퍼 (Z-레이어 뒤 배치 및 캡처 범위 보존) */}
      <div ref={cardRef} className="recommended-card-outer-wrap">
        
        {/* 캐릭터가 프레임 뒤로 쏙 안착하도록 top 좌표 하향 안정화 적용 */}
        <div className="result-char-illust-wrap">
          <img 
            src={getResultCharacterImage()} 
            alt={recommendedDept.characterName} 
            className="result-char-illust-img"
            draggable={false}
          />
        </div>

        {/* 결과 프레임 요약 카드 (배지를 흐름 내부로 합쳐서 정합성 복구) */}
        <div 
          className="recommended-dept-card"
          style={{
            borderColor: recommendedDept.color.primary,
            boxShadow: `0 10px 0 ${recommendedDept.color.shadow}`,
            backgroundColor: recommendedDept.color.light,
          }}
        >
          {/* 📍 겹침을 방지하기 위해 텍스트 흐름에 자연스럽게 합쳐진 전공 배지 */}
          <div 
            className="result-tag-merged" 
            style={{ 
              backgroundColor: recommendedDept.color.primary,
              color: '#ffffff'
            }}
          >
            나에게 가장 어울리는 전공
          </div>
          
          <div className="result-sub-type">
            성격 유형: "{recommendedDept.resultTitle}"
          </div>

          <h1 className="result-dept-title" style={{ color: recommendedDept.color.primary }}>
            {recommendedDept.name}
          </h1>
          <p className="recommendation-text">{recommendedDept.name}과를 추천합니다!</p>

          <p className="result-dept-desc">
            {recommendedDept.description}
          </p>

          {/* 프리미엄 카드 마킹 엠블럼 해시태그 */}
          <div className="card-mbti-tags">
            <span className="mbti-tag" style={{ color: recommendedDept.color.primary, backgroundColor: '#ffffff', borderColor: recommendedDept.color.primary }}>
              # 세경고_추천_1위
            </span>
            <span className="mbti-tag" style={{ color: recommendedDept.color.primary, backgroundColor: '#ffffff', borderColor: recommendedDept.color.primary }}>
              # {recommendedDept.badgeName.split(' ')[1] || '전공'}마스터
            </span>
          </div>
        </div>

      </div>

      {/* 성향 수치 시각화 (레이더 차트 + 백분율 스케일 보정된 바 차트) */}
      <div className="result-chart-section">
        <h3 className="section-title">📊 나의 7대 적성 지표</h3>
        
        <div className="canvas-wrapper">
          <canvas ref={canvasRef} width={340} height={260} />
        </div>

        {/* 100점 만점 기준의 배점 기반 백분율 바 차트 */}
        <div className="bar-charts-container">
          {radarLabels.map((lbl) => {
            const score = scores[lbl.key] || 0;
            // 📍 각 문제 배점 합산 100점 만점 기준으로 정확한 백분율 계산
            const percent = Math.min(100, Math.round(score)); 
            return (
              <div key={lbl.key} className="bar-chart-row">
                <span className="bar-label">{lbl.name}</span>
                <div className="bar-track">
                  <div 
                    className="bar-fill" 
                    style={{
                      width: `${percent}%`,
                      backgroundColor: recommendedDept.color.primary
                    }}
                  />
                </div>
                <span className="bar-percent" style={{ color: recommendedDept.color.primary }}>
                  {percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 수집한 뱃지 현황 */}
      <div className="result-badge-section">
        <h3 className="section-title">🎖️ 모은 전공 뱃지 ({badgeList.length}/7)</h3>
        <div className="badge-grid">
          {DEPARTMENTS.map(dept => {
            const hasBadge = badgeList.includes(dept.id);
            return (
              <div 
                key={dept.id} 
                className={`badge-showcase-item ${hasBadge ? 'acquired' : 'locked'}`}
                style={{
                  borderColor: hasBadge ? dept.color.primary : '#e2e8f0',
                  backgroundColor: hasBadge ? dept.color.light : '#f8fafc',
                }}
              >
                <div className="badge-icon-wrap" style={{ opacity: hasBadge ? 1 : 0.25 }}>
                  {hasBadge ? dept.badgeIcon : '🔒'}
                </div>
                <div className="badge-info-name" style={{ color: hasBadge ? dept.color.primary : '#94a3b8' }}>
                  {dept.name.substring(0, 5)}...
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 피그마 3D 액션 버튼 영역 */}
      <div className="result-actions">
        <button 
          className="result-btn download-btn"
          onClick={handleDownloadCard}
          style={{
            backgroundColor: '#10b981',
            borderColor: '#10b981',
            boxShadow: '0 6px 0 #047857',
            color: '#ffffff'
          }}
        >
          🖼️ 결과 카드 저장하기
        </button>

        <button 
          className="result-btn share-btn"
          onClick={handleShare}
          style={{
            backgroundColor: recommendedDept.color.primary,
            borderColor: recommendedDept.color.primary,
            boxShadow: `0 6px 0 ${recommendedDept.color.shadow}`
          }}
        >
          🔗 결과 링크 공유하기
        </button>

        {isSharedEntry ? (
          <button 
            className="result-btn restart-btn invite-btn"
            onClick={handleGoToTest}
            style={{
              backgroundColor: '#facc15',
              borderColor: '#facc15',
              boxShadow: '0 6px 0 #ca8a04',
              color: '#1e293b'
            }}
          >
            🚀 나도 분석 테스트하러 가기
          </button>
        ) : (
          <button 
            className="result-btn restart-btn"
            onClick={onReset}
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#cbd5e1',
              boxShadow: '0 6px 0 #94a3b8',
              color: '#475569'
            }}
          >
            처음부터 다시하기
          </button>
        )}
      </div>

      <style>{`
        .result-screen-container {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          padding: 20px 16px 40px 16px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .result-screen-container::-webkit-scrollbar {
          width: 4px;
        }
        .result-screen-container::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.15);
          border-radius: 4px;
        }

        .result-intro-speech {
          background-color: #ffffff;
          border: 3px solid #cbd5e1;
          border-radius: 16px;
          padding: 12px 16px;
          font-size: 16px;
          color: #334155;
          font-weight: 500;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          line-height: 1.4;
        }

        /* 캐릭터와 프레임 Z-index 결합 래퍼 (정수리와 말풍선 간격을 아래쪽 카드 간격만큼 24px로 콤팩트 조정) */
        .recommended-card-outer-wrap {
          position: relative;
          width: 100%;
          margin-top: 44px; /* 95px에서 44px로 줄여 예쁜 카드 간격과 일치화 */
          padding-top: 110px; /* 정수리 높이에 최적화된 고화질 캡처 패딩 */
        }

        /* 캐릭터는 프레임 뒤(z-index: 1)로 배치 */
        .result-char-illust-wrap {
          position: absolute;
          top: -55px; /* 얼굴만 둥둥 뜨는 단두대 현상을 차단하고 운전대/상체가 온전히 노출되도록 상향 복구 */
          left: 50%;
          transform: translateX(-50%);
          height: 220px;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          z-index: 1; 
          pointer-events: none;
        }

        .result-char-illust-img {
          height: 100%;
          max-height: 220px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.18));
        }

        /* 프레임 카드는 z-index: 2로 앞에 노출, 투명하지 않은 배경 */
        .recommended-dept-card {
          position: relative;
          width: 100%;
          border: 4px solid;
          border-radius: 24px;
          padding: 28px 20px 24px 20px; /* 상단 배지가 내부로 왔으므로 여백 정돈 */
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          z-index: 2; 
        }

        /* 📍 합쳐져서 내부로 안착된 전공 타이틀 배지 */
        .result-tag-merged {
          font-family: var(--font-mitmi), sans-serif;
          font-size: 15px;
          font-weight: bold;
          padding: 6px 20px;
          border-radius: 20px;
          margin-bottom: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
          display: inline-block;
        }

        .result-sub-type {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .result-dept-title {
          font-size: 25px;
          line-height: 1.2;
          margin-bottom: 12px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .result-dept-desc {
          font-size: 16px;
          line-height: 1.5;
          color: #475569;
          margin-bottom: 18px;
        }

        /* 프리미엄 카드 마킹 엠블럼 해시태그 */
        .card-mbti-tags {
          display: flex;
          gap: 8px;
          justify-content: center;
          width: 100%;
        }

        .mbti-tag {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1.5px solid;
          font-family: var(--font-mitmi), sans-serif;
        }

        .result-chart-section {
          width: 100%;
          background-color: #ffffff;
          border: 3px solid #e2e8f0;
          border-radius: 20px;
          padding: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
        }

        .section-title {
          font-size: 17px;
          color: #334155;
          margin-bottom: 14px;
        }

        .canvas-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 16px;
        }

        /* 가로형 적성 지표 바 차트 스타일 */
        .bar-charts-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          padding: 0 8px;
        }

        .bar-chart-row {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 12px;
        }

        .bar-label {
          font-size: 13px;
          color: #475569;
          width: 76px;
          text-align: left;
        }

        .bar-track {
          flex: 1;
          height: 12px;
          background-color: #f1f5f9;
          border-radius: 6px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .bar-percent {
          font-size: 13px;
          font-weight: 500;
          width: 38px;
          text-align: right;
        }

        .result-badge-section {
          width: 100%;
          background-color: #ffffff;
          border: 3px solid #e2e8f0;
          border-radius: 20px;
          padding: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
        }

        .badge-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .badge-showcase-item {
          border: 2px solid;
          border-radius: 12px;
          padding: 8px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-align: center;
        }

        .badge-icon-wrap {
          font-size: 24px;
          transition: transform 0.2s ease;
        }

        .badge-showcase-item.acquired:hover .badge-icon-wrap {
          transform: scale(1.2) rotate(8deg);
        }

        .badge-info-name {
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        .result-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .result-btn {
          width: 100%;
          height: 52px;
          border: 3px solid;
          border-radius: 16px;
          font-size: 18px;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .result-btn:active {
          transform: translateY(3px);
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.35) !important;
        }
      `}</style>
    </div>
  );
};
