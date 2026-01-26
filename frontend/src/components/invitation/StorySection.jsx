import React from 'react';
import { CDN_URL } from '@/constants/cdn';
import '@styles/StorySection.css';

const StorySection = () => {
  const CDN = CDN_URL;
  return (
    <section className="story-container">
      <div className="story-symbol"></div>

      <div className="story-content">
        <h3 className="story-intro-title">
          두 사람이 함께 걸어갈
          <br />
          새로운 길의 시작을 알립니다.
        </h3>

        <p className="story-main-text">
          바쁘신 중에도 오셔서 축복해 주신다면
          <br />그 마음 오래 간직하며 감사히 기억하겠습니다.
        </p>

        <div className="family-relation">
          <div className="relation-row">
            <span className="parents">김정민 · 이민숙의 장남</span>
            <span className="groom-name">김철수</span>
          </div>
          <div className="relation-row">
            <span className="parents">이준호 · 김수미의 차녀</span>
            <span className="bride-name">이민지</span>
          </div>
        </div>
      </div>
      <div className="story-photo-grid">
        <div className="photo-item large">
          <img src={`${CDN}/wedding/groom.avif`} alt="신랑" />
        </div>
        <div className="photo-item large">
          <img src={`${CDN}/wedding/bride.jpg`} alt="신부" />
        </div>
      </div>
    </section>
  );
};

export default StorySection;
