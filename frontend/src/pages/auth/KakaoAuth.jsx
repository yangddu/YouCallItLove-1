import React from 'react';

const baseUrl = import.meta.env.VITE_API_URL;
const KakaoAuth = () => {
  return (
    <button
      onClick={() => {
        window.location.href = `${baseUrl}/api/auth/kakao`;
      }}
    >
      카카오 로그인
    </button>
  );
};

export default KakaoAuth;
