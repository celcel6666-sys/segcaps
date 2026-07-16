import React, { useEffect, useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { DEPARTMENTS } from '../data/departments';
import type { Department } from '../data/departments';

import mediaEnding from '../assets/ending/back-ascii/media.webp';
import nursingEnding from '../assets/ending/back-ascii/nursing.webp';
import automotiveEnding from '../assets/ending/back-ascii/automotive.webp';
import avionicsEnding from '../assets/ending/back-ascii/avionics.webp';
import architectureEnding from '../assets/ending/back-ascii/architecture.webp';
import militaryEnding from '../assets/ending/back-ascii/military.webp';
import semiconductorEnding from '../assets/ending/back-ascii/semiconductor.webp';

interface ResultScreenProps {
  scores: Record<string, number>;
  badgeList: string[];
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

const DEPT_LABELS: Record<string, string> = {
  MEDIA: '미디어디자인과',
  NURSING: '보건간호과',
  AUTOMOTIVE: '미래자동차과',
  AVIONICS: '항공전자과',
  ARCHITECTURE: '건축디자인과',
  MILITARY: '군특성화과',
  SEMICONDUCTOR: '반도체디스플레이과',
};

const RADAR_LABELS = [
  { name: '예술성', key: 'artistic' },
  { name: '배려심', key: 'caring' },
  { name: '논리력', key: 'logical' },
  { name: '공간감', key: 'spatial' },
  { name: '기술력', key: 'technical' },
  { name: '정밀성', key: 'precision' },
  { name: '책임감', key: 'responsibility' },
];

export const ResultScreen: React.FC<ResultScreenProps> = ({
  scores,
  badgeList,
  onReset,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
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
  const shareUrl = `${window.location.origin}${window.location.pathname}?result=${recommendedDept.id}`;
  const shareText = `나에게 어울리는 세경고 학과는 ${deptName}!`;
  const isSharedEntry = window.location.search.includes('result');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 320;
    const height = 250;
    const centerX = width / 2;
    const centerY = height / 2 + 8;
    const radius = 72;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    for (let level = 1; level <= 4; level += 1) {
      const levelRadius = radius * (level / 4);
      ctx.beginPath();
      RADAR_LABELS.forEach((_, index) => {
        const angle = (index * 2 * Math.PI) / RADAR_LABELS.length - Math.PI / 2;
        const x = centerX + levelRadius * Math.cos(angle);
        const y = centerY + levelRadius * Math.sin(angle);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.strokeStyle = '#dbeafe';
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    RADAR_LABELS.forEach((_, index) => {
      const angle = (index * 2 * Math.PI) / RADAR_LABELS.length - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    const points = RADAR_LABELS.map((label, index) => {
      const score = Math.max(8, Math.min(100, scores[label.key] || 0));
      const angle = (index * 2 * Math.PI) / RADAR_LABELS.length - Math.PI / 2;
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
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = recommendedDept.color.primary;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    ctx.font = '700 12px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.textBaseline = 'middle';
    RADAR_LABELS.forEach((label, index) => {
      const angle = (index * 2 * Math.PI) / RADAR_LABELS.length - Math.PI / 2;
      const x = centerX + (radius + 28) * Math.cos(angle);
      const y = centerY + (radius + 20) * Math.sin(angle);
      ctx.textAlign = Math.cos(angle) > 0.2 ? 'left' : Math.cos(angle) < -0.2 ? 'right' : 'center';
      ctx.fillText(label.name, x, y);
    });
  }, [recommendedDept.color.primary, scores]);

  const captureResultCard = async () => {
    if (!cardRef.current) return null;

    return html2canvas(cardRef.current, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
      logging: false,
    });
  };

  const handleDownloadCard = async () => {
    try {
      const canvas = await captureResultCard();
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
      alert('공유 링크가 복사되었습니다.');
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      alert('공유 링크가 복사되었습니다.');
    }
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
        // The platform share sheet was dismissed, so fall back to the in-page options.
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
      <div className="ending-card-wrap">
        <div ref={cardRef} className="ending-card">
          <img src={endingImage} alt={`${deptName} 결과 배경`} className="ending-bg" draggable={false} />

          <div className="ending-center-panel">
            <div className="ending-title">
              <span>{deptName}</span>
              <strong>추천 결과</strong>
            </div>

            <div className="chart-layout">
              <div className="radar-box">
                <canvas ref={canvasRef} width={320} height={250} />
              </div>

              <div className="bar-list">
                {RADAR_LABELS.map((label) => {
                  const percent = Math.min(100, Math.round(scores[label.key] || 0));
                  return (
                    <div key={label.key} className="bar-row">
                      <span className="bar-label">{label.name}</span>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: recommendedDept.color.primary,
                          }}
                        />
                      </div>
                      <span className="bar-percent">{percent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="ending-summary">
              획득 배지 {badgeList.length}/7개 · 가장 높은 적성은 {deptName}와 잘 어울립니다.
            </p>
          </div>
        </div>
      </div>

      <div className="result-actions">
        <button className="result-btn share-btn" onClick={handleShare}>
          공유하기
        </button>
        <button className="result-btn download-btn" onClick={handleDownloadCard}>
          이미지 저장하기
        </button>
        {isSharedEntry ? (
          <button className="result-btn restart-btn" onClick={() => {
            window.location.href = window.location.origin + window.location.pathname;
          }}>
            나도 테스트하기
          </button>
        ) : (
          <button className="result-btn restart-btn" onClick={onReset}>
            처음부터 다시하기
          </button>
        )}
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
          padding: 18px 14px 34px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          background: #f8fafc;
        }

        .ending-card-wrap {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .ending-card {
          position: relative;
          width: min(100%, 560px);
          overflow: hidden;
          border-radius: 18px;
          background: #ffffff;
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.16);
        }

        .ending-bg {
          display: block;
          width: 100%;
          height: auto;
          user-select: none;
        }

        .ending-center-panel {
          position: absolute;
          left: 7.2%;
          right: 7.2%;
          top: 24.5%;
          min-height: 45%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.86);
          box-sizing: border-box;
        }

        .ending-title {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 8px;
          color: #0f172a;
          text-align: center;
          white-space: nowrap;
        }

        .ending-title span {
          font-size: 17px;
          font-weight: 700;
          color: ${recommendedDept.color.primary};
        }

        .ending-title strong {
          font-size: 20px;
        }

        .chart-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
          align-items: center;
        }

        .radar-box {
          display: flex;
          justify-content: center;
          min-height: 190px;
          overflow: hidden;
        }

        .radar-box canvas {
          max-width: 100%;
          height: auto !important;
        }

        .bar-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .bar-row {
          display: grid;
          grid-template-columns: 54px 1fr 36px;
          gap: 8px;
          align-items: center;
        }

        .bar-label,
        .bar-percent {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
          line-height: 1;
        }

        .bar-percent {
          text-align: right;
        }

        .bar-track {
          height: 10px;
          overflow: hidden;
          border-radius: 999px;
          background: #e2e8f0;
        }

        .bar-fill {
          height: 100%;
          border-radius: 999px;
        }

        .ending-summary {
          margin: 2px 0 0;
          text-align: center;
          font-size: 12px;
          line-height: 1.35;
          color: #475569;
          font-weight: 700;
        }

        .result-actions {
          width: min(100%, 560px);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .result-btn {
          height: 50px;
          border: 0;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 800;
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
          .result-screen-container {
            padding-top: 26px;
          }

          .ending-center-panel {
            left: 8%;
            right: 8%;
            top: 25%;
            padding: 18px 22px;
          }

          .chart-layout {
            grid-template-columns: 1fr 0.95fr;
            gap: 8px;
          }

          .radar-box {
            min-height: 250px;
          }

          .bar-row {
            grid-template-columns: 62px 1fr 42px;
          }

          .bar-label,
          .bar-percent,
          .ending-summary {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};
