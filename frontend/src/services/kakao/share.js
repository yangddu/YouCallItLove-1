import { initKakao } from '@services/kakao/core.js';

export function shareKakaoTalk(options) {
  const {
    jsKey,
    title,
    description,
    imageUrl,
    webUrl
  } = options;

  const Kakao = initKakao(jsKey);

  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: title,
      description: description || '',
      imageUrl: imageUrl,
      link: {
        webUrl: webUrl,
        mobileWebUrl: webUrl
      }
    },
    buttons: [
      {
        title: '웹으로 보기',
        link: {
          webUrl: webUrl,
          mobileWebUrl: webUrl
        }
      }
    ]
  });
}
