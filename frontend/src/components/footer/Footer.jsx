import React from 'react';
import { shareKakaoTalk } from '@services/kakao/share';
import { useAlert } from '@/hooks/useAlert';
import { CDN_URL } from '@constants/cdn';
import '@styles/Footer.css';
import kakaoIcon from '@/assets/img.png';
import copyLinkIcon from '@/assets/4602047.png';

const Footer = () => {
  const { Kakao } = window;
  const url = CDN_URL;
  const showAlert = useAlert();

  const simpleUrl = window.location.href;

  const handleKakaoShare = () => {
    shareKakaoTalk({
      jsKey: import.meta.env.VITE_KAKAO_JS_KEY,
      title: '철수 & 민지의 특별한 날 💍',
      description: '함께 자리에 오셔서 축하해주시면 감사하겠습니다.',
      imageUrl: `${url}/wedding/gallery01.png`,
      webUrl: `${simpleUrl}`,
    });
  };

  const copyToClipboard = () => {
    const url = `${simpleUrl}`;

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
          <img src={kakaoIcon} className="share-kakao" />
        </button>
        <button onClick={copyToClipboard} className="btn-copy">
          <img src={copyLinkIcon} className="share-link" />
        </button>
      </div>
      <p className="copyright">©chaeculson</p>
    </div>
  );
};

export default Footer;
