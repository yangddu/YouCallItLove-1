import React from 'react';
import '@styles/ClosingSection.css';

const ClosingSection = () => {
  const groomPhone = '010-1234-5678';
  const bridePhone = '010-5678-1234';

  return (
    <section className="closing-container">
      <div className="closing-content">
        <h2 className="closing-eng-title">OUR SINCERE THANKS</h2>
        <p className="closing-footer-text">
          소중한 분들과 함께할 이 날을
          <br />
          마음 깊이 기다리고 있겠습니다.
        </p>
        <div className="contact-button-group">
          <a href={`tel:${groomPhone}`} className="contact-btn">
            신랑에게 연락하기
          </a>
          <a href={`tel:${bridePhone}`} className="contact-btn">
            신부에게 연락하기
          </a>
        </div>
      </div>
    </section>
  );
};
export default ClosingSection;
