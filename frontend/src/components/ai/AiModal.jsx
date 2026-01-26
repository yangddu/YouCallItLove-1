import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/feature/api/fetchApi';
import { WEATHER_DESC_KO } from '@/constants/weather';
import '@styles/AiModal.css';

const AiModal = ({ onClose }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const aiData = async () => {
      try {
        const res = await fetchApi('/api/ai/recommend', 'GET');

        if (!isCancelled) {
          setData(res.data.data);
        }
      } catch (e) {
        if (!isCancelled) {
          console.error('데이터 로드 실패:', e);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    aiData();

    return () => {
      isCancelled = true;
      setData(null);
    };
  }, []);

  const rec = data?.recommendation;

  return (
    <div className="ai-modal-container">
      <div className="bottom-sheet-handle" onClick={onClose} />

      <button className="modal-close-btn" onClick={onClose}>
        ✕
      </button>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner">🪄</div>
          <p>AI가 오늘의 날씨와 코디를 분석 중입니다...</p>
        </div>
      ) : (
        <div className="ai-content">
          <header className="ai-header">
            <h3>🌤️ 오늘의 하객룩 추천</h3>
            <p className="weather-info">
              현재 서울은 <strong>{data?.weather?.temp}°C</strong>,{' '}
              {WEATHER_DESC_KO[data?.weather?.condition]}입니다.
            </p>
          </header>

          <div className="outfit-list">
            <div className="outfit-item">
              <strong>상의:</strong> {rec?.top}
            </div>
            <div className="outfit-item">
              <strong>하의:</strong> {rec?.bottom}
            </div>
            {rec?.outer && (
              <div className="outfit-item">
                <strong>아우터:</strong> {rec?.outer}
              </div>
            )}
            {rec?.acc && (
              <div className="outfit-item">
                <strong>준비물:</strong> {rec?.acc}
              </div>
            )}
          </div>

          <div className="ai-reason-box">
            <span className="ai-icon">💡</span>
            <p className="ai-reason">{rec?.reason}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiModal;
