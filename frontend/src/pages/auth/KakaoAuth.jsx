import React from 'react';

const KakaoAuth = () => {
  return (
    <button
      onClick={() => {
        window.location.href = 'http://localhost:3000/api/auth/kakao';
      }}
    >
      카카오 로그인
    </button>
  );
};

export default KakaoAuth;
