import { initKakao } from '@services/kakao/core.js';

export function shareKakaoTalk(options) {
  const { jsKey, webUrl } = options;

  const Kakao = initKakao(jsKey);

  Kakao.Share.sendScrap({
    requestUrl: webUrl,
  });
}
