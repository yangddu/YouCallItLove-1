import React from 'react';
import { shareKakaoTalk } from '@services/kakao/share';
import { useAlert } from '@/hooks/useAlert';
import { CDN_URL } from '@constants/cdn';
import '@styles/Footer.css';

const Footer = () => {
  const { Kakao } = window; // 브라우저 window 객체에서 Kakao 추출
  const url = CDN_URL;
  const showAlert = useAlert();

  const handleKakaoShare = () => {
    shareKakaoTalk({
      jsKey: import.meta.env.VITE_KAKAO_JS_KEY,
      title: '우리 결혼합니다 💌',
      description: '함께 자리에 오셔서 축하해주시면 감사하겠습니다.',
      imageUrl: `${url}/wedding/ggggg.jpeg`,
      webUrl: window.location.href,
    });
  };

  const copyToClipboard = () => {
    const url = window.location.href;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        showAlert({
          message: `주소가 복사되었습니다!`,
          type: 'default',
          closeOnOverlayClick: true,
        });
      })
      .catch((err) => {
        console.error('복사 실패', err);
      });
  };

  return (
    <div className="share-container">
      <div className="share-button-content">
        <button
          id="kakao-link-btn"
          className="btn-kakao"
          onClick={handleKakaoShare}
        >
          <img src="/src/assets/img.png" className="share-kakao" />
        </button>
        <button onClick={copyToClipboard} className="btn-copy">
          <img src="/src/assets/4602047.png" className="share-link" />
        </button>
      </div>
      <p className="copyright">©chaeculson</p>
    </div>
  );
};

export default Footer;
