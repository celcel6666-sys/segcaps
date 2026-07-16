import React, { useMemo, useState } from 'react';
import { DEPARTMENTS } from '../data/departments';
import type { Department } from '../data/departments';

import mediaEnding from '../assets/ending/back-ascii/media.webp';
import nursingEnding from '../assets/ending/back-ascii/nursing.webp';
import automotiveEnding from '../assets/ending/back-ascii/automotive.webp';
import avionicsEnding from '../assets/ending/back-ascii/avionics.webp';
import architectureEnding from '../assets/ending/back-ascii/architecture.webp';
import militaryEnding from '../assets/ending/back-ascii/military.webp';
import semiconductorEnding from '../assets/ending/back-ascii/semiconductor.webp';
import mediaDown from '../assets/ending/down-ascii/media.webp';
import nursingDown from '../assets/ending/down-ascii/nursing.webp';
import automotiveDown from '../assets/ending/down-ascii/automotive.webp';
import avionicsDown from '../assets/ending/down-ascii/avionics.webp';
import architectureDown from '../assets/ending/down-ascii/architecture.webp';
import militaryDown from '../assets/ending/down-ascii/military.webp';
import semiconductorDown from '../assets/ending/down-ascii/semiconductor.webp';

interface ResultScreenProps {
  scores: Record<string, number>;
  badgeList: string[];
  playerName: string;
  onReset: () => void;
}

const ENDING_IMAGES: Record<string, string> = {
  MEDIA: mediaEnding,
  NURSING: nursingEnding,
  AUTOMOTIVE: automotiveEnding,
  AVIONICS: avionicsEnding,
  ARCHITECTURE: architectureEnding,
  MILITARY: militaryEnding,
  SEMICONDUCTOR: semiconductorEnding,
};

const DOWNLOAD_IMAGES: Record<string, string> = {
  MEDIA: mediaDown,
  NURSING: nursingDown,
  AUTOMOTIVE: automotiveDown,
  AVIONICS: avionicsDown,
  ARCHITECTURE: architectureDown,
  MILITARY: militaryDown,
  SEMICONDUCTOR: semiconductorDown,
};

const DEPT_LABELS: Record<string, string> = {
  MEDIA: '미디어디자인과',
  NURSING: '보건간호과',
  AUTOMOTIVE: '미래자동차과',
  AVIONICS: '항공전자과',
  ARCHITECTURE: '건축디자인과',
  MILITARY: '군특성화과',
  SEMICONDUCTOR: '반도체디스플레이과',
};

const RESULT_BARS = [
  { name: '예술성', key: 'artistic', icon: '🎨', color: '#3b82f6' },
  { name: '따뜻한 마음', key: 'caring', icon: '💗', color: '#f472b6' },
  { name: '창의성', key: 'logical', icon: '🛠️', color: '#f59e0b' },
  { name: '분석성', key: 'spatial', icon: '📕', color: '#ef4444' },
  { name: '기술성', key: 'technical', icon: '🚗', color: '#64748b' },
  { name: '정밀성', key: 'precision', icon: '✈️', color: '#38bdf8' },
  { name: '책임성', key: 'responsibility', icon: '🪖', color: '#65a30d' },
];

export const ResultScreen: React.FC<ResultScreenProps> = ({
  scores,
  badgeList,
  playerName,
  onReset,
}) => {
  const [shareOpen, setShareOpen] = useState(false);

  const recommendedDept = useMemo<Department>(() => {
    return DEPARTMENTS.reduce((best, dept) => {
      const bestScore = scores[best.scoreKey] || 0;
      const deptScore = scores[dept.scoreKey] || 0;
      return deptScore > bestScore ? dept : best;
    }, DEPARTMENTS[0]);
  }, [scores]);

  const deptName = DEPT_LABELS[recommendedDept.id] || recommendedDept.name;
  const endingImage = ENDING_IMAGES[recommendedDept.id] || mediaEnding;
  const downloadImage = DOWNLOAD_IMAGES[recommendedDept.id] || mediaDown;
  const shareUrl = `${window.location.origin}${window.location.pathname}?result=${recommendedDept.id}`;
  const shareText = `나에게 어울리는 세경고 학과는 ${deptName}!`;
  const isSharedEntry = window.location.search.includes('result');

  const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

  const drawDownloadRadar = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    const centerX = width * 0.762;
    const centerY = height * 0.512;
    const radius = width * 0.118;
    const sides = RESULT_BARS.length;

    ctx.save();

    for (let level = 1; level <= 4; level += 1) {
      const levelRadius = radius * (level / 4);
      ctx.beginPath();
      RESULT_BARS.forEach((_, index) => {
        const angle = (index * 2 * Math.PI) / sides - Math.PI / 2;
        const x = centerX + levelRadius * Math.cos(angle);
        const y = centerY + levelRadius * Math.sin(angle);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.strokeStyle = '#b9d9ff';
      ctx.lineWidth = width * 0.0032;
      ctx.stroke();
    }

    RESULT_BARS.forEach((_, index) => {
      const angle = (index * 2 * Math.PI) / sides - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
      ctx.strokeStyle = '#d7eaff';
      ctx.lineWidth = width * 0.0024;
      ctx.stroke();
    });

    const points = RESULT_BARS.map((item, index) => {
      const score = Math.max(8, Math.min(100, scores[item.key] || 0));
      const angle = (index * 2 * Math.PI) / sides - Math.PI / 2;
      return {
        x: centerX + radius * (score / 100) * Math.cos(angle),
        y: centerY + radius * (score / 100) * Math.sin(angle),
      };
    });

    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.fillStyle = `${recommendedDept.color.primary}33`;
    ctx.strokeStyle = recommendedDept.color.primary;
    ctx.lineWidth = width * 0.007;
    ctx.fill();
    ctx.stroke();

    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, width * 0.011, 0, Math.PI * 2);
      ctx.fillStyle = recommendedDept.color.primary;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = width * 0.004;
      ctx.stroke();
    });

    ctx.font = `900 ${Math.round(width * 0.018)}px sans-serif`;
    ctx.fillStyle = '#334155';
    ctx.textBaseline = 'middle';
    RESULT_BARS.forEach((item, index) => {
      const angle = (index * 2 * Math.PI) / sides - Math.PI / 2;
      const labelRadius = radius * 1.28;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      ctx.textAlign = Math.cos(angle) > 0.25 ? 'left' : Math.cos(angle) < -0.25 ? 'right' : 'center';
      ctx.fillText(item.name, x, y);
    });

    ctx.restore();
  };

  const createDownloadCard = async () => {
    const cardPlayerName = playerName.trim();
    const image = await loadImage(downloadImage);
    const deviceScale = window.devicePixelRatio || 1;
    const viewportWidth = Math.max(window.innerWidth || image.naturalWidth, 360);
    const targetWidth = Math.min(image.naturalWidth, Math.max(720, Math.round(viewportWidth * deviceScale)));
    const targetHeight = Math.round(targetWidth * (image.naturalHeight / image.naturalWidth));
    const scale = targetWidth / image.naturalWidth;
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    if (cardPlayerName) {
      ctx.save();
      ctx.font = `900 ${Math.round(canvas.width * 0.038)}px sans-serif`;
      ctx.fillStyle = '#111827';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      // 이름이 '님의 결과 입니다' 문구와 완벽히 수평인 상태로 왼쪽에 위치하도록 수정 (X: 0.42, Y: 0.205)
      ctx.fillText(cardPlayerName, canvas.width * 0.42, canvas.height * 0.205);
      ctx.restore();
    }

    ctx.save();
    ctx.scale(scale, scale);
    drawDownloadRadar(ctx, image.naturalWidth, image.naturalHeight);
    ctx.restore();
    return canvas;
  };

  const handleDownloadCard = async () => {
    try {
      const canvas = await createDownloadCard();
      if (!canvas) return;

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `segyeong_result_${recommendedDept.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert('이미지 저장에 실패했습니다. 브라우저를 최신 버전으로 업데이트한 뒤 다시 시도해 주세요.');
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    alert('공유 링크가 복사되었습니다.');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '세경고 학과 추천 결과',
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // The native share sheet was dismissed, so show the manual options.
      }
    }

    setShareOpen(true);
  };

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=720,height=640');
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const shareLinks = [
    { label: '카카오스토리', url: `https://story.kakao.com/share?url=${encodedUrl}` },
    { label: '페이스북', url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'X', url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}` },
    { label: '라인', url: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}` },
    { label: '밴드', url: `https://band.us/plugin/share?body=${encodedText}%0A${encodedUrl}&route=${encodedUrl}` },
  ];

  return (
    <div className="result-screen-container">
      <div className="ending-result-stack">
        <div className="ending-card">
          <img src={endingImage} alt={`${deptName} 결과 배경`} className="ending-bg" draggable={false} />

          <section className="result-bar-panel" aria-label="적성 결과 막대 그래프">
            <div className="bar-panel-head">
              <span>{deptName}</span>
              <strong>추천 결과</strong>
            </div>

            <div className="bar-list">
              {RESULT_BARS.map((item) => {
                const percent = Math.min(100, Math.round(scores[item.key] || 0));
                return (
                  <div key={item.key} className="bar-row">
                    <div className="bar-title">
                      <span className="bar-icon" aria-hidden="true">{item.icon}</span>
                      <span className="bar-name" style={{ color: item.color }}>{item.name}</span>
                      <span className="bar-percent">{percent}%</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="ending-summary">
              획득 배지 {badgeList.length}/7개 · 가장 높은 적성은 {deptName}와 잘 어울립니다.
            </p>
          </section>
        </div>

        <div className="result-actions">
          <button className="result-btn share-btn" onClick={handleShare}>
            공유하기
          </button>
          <button className="result-btn download-btn" onClick={handleDownloadCard}>
            이미지 저장하기
          </button>
          {isSharedEntry ? (
            <button
              className="result-btn restart-btn"
              onClick={() => {
                window.location.href = window.location.origin + window.location.pathname;
              }}
            >
              나도 테스트하기
            </button>
          ) : (
            <button className="result-btn restart-btn" onClick={onReset}>
              처음부터 다시하기
            </button>
          )}
        </div>
      </div>

      {shareOpen && (
        <div className="share-modal-backdrop" role="presentation" onClick={() => setShareOpen(false)}>
          <div className="share-modal" role="dialog" aria-modal="true" aria-label="SNS 공유하기" onClick={(event) => event.stopPropagation()}>
            <div className="share-modal-head">
              <strong>SNS 공유하기</strong>
              <button type="button" onClick={() => setShareOpen(false)} aria-label="닫기">×</button>
            </div>
            <div className="share-platform-grid">
              {shareLinks.map((link) => (
                <button key={link.label} type="button" onClick={() => openShareWindow(link.url)}>
                  {link.label}
                </button>
              ))}
              <button type="button" onClick={copyShareLink}>
                링크 복사
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .result-screen-container {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          padding: 0 0 28px;
          background: #f8fafc;
        }

        .ending-result-stack {
          width: 100%;
          max-width: 560px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ending-card {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #ffffff;
        }

        .ending-bg {
          display: block;
          width: 100%;
          height: auto;
          user-select: none;
        }

        .result-bar-panel {
          position: absolute;
          left: 4.5%;
          right: 4.5%;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 30px;
          padding: 28px 18px 30px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.9);
          box-sizing: border-box;
        }

        .bar-panel-head {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 8px;
          color: #0f172a;
          text-align: center;
          white-space: nowrap;
        }

        .bar-panel-head span {
          font-size: 30px;
          font-weight: 800;
          color: ${recommendedDept.color.primary};
        }

        .bar-panel-head strong {
          font-size: 34px;
        }

        .bar-list {
          display: flex;
          flex-direction: column;
          gap: 39px;
        }

        .bar-row {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .bar-title {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 4px;
          align-items: center;
          min-width: 0;
        }

        .bar-icon {
          width: 38px;
          text-align: center;
          font-size: 30px;
          line-height: 1;
        }

        .bar-name,
        .bar-percent {
          font-size: 28px;
          font-weight: 900;
          line-height: 1.1;
        }

        .bar-percent {
          color: #475569;
          text-align: right;
        }

        .bar-track {
          height: 24px;
          overflow: hidden;
          border-radius: 999px;
          background: #e5e7eb;
        }

        .bar-fill {
          height: 100%;
          min-width: 0;
          border-radius: 999px;
          transition: width 0.7s ease;
        }

        .ending-summary {
          margin: 0;
          text-align: center;
          font-size: 22px;
          line-height: 1.35;
          color: #64748b;
          font-weight: 800;
        }

        .result-actions {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 0 14px 14px;
          box-sizing: border-box;
        }

        .result-btn {
          height: 50px;
          border: 0;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 900;
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 6px 0 rgba(15, 23, 42, 0.2);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .result-btn:active {
          transform: translateY(3px);
          box-shadow: 0 3px 0 rgba(15, 23, 42, 0.24);
        }

        .share-btn {
          background: ${recommendedDept.color.primary};
        }

        .download-btn {
          background: #10b981;
        }

        .restart-btn {
          grid-column: 1 / -1;
          background: #475569;
        }

        .share-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(15, 23, 42, 0.55);
        }

        .share-modal {
          width: min(100%, 360px);
          border-radius: 18px;
          background: #ffffff;
          padding: 16px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.24);
        }

        .share-modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          color: #0f172a;
        }

        .share-modal-head strong {
          font-size: 18px;
        }

        .share-modal-head button {
          width: 32px;
          height: 32px;
          border: 0;
          border-radius: 50%;
          background: #f1f5f9;
          color: #334155;
          font-size: 24px;
          line-height: 1;
          cursor: pointer;
        }

        .share-platform-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .share-platform-grid button {
          min-height: 44px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          color: #334155;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }

        @media (min-width: 720px) {
          .result-bar-panel {
            top: 50%;
            padding: 30px 24px 32px;
          }

          .bar-list {
            gap: 42px;
          }

          .bar-track {
            height: 26px;
          }

          .bar-name,
          .bar-percent {
            font-size: 30px;
          }
        }
      `}</style>
    </div>
  );
};
