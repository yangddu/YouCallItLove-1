export function initKakao(key) {
    if (!window.Kakao) {
        throw new Error('Kakao SDK not loaded');
    }

    if (window.Kakao.isInitialized()) {
        window.Kakao.cleanup();
    }
    window.Kakao.init(key);

    return window.Kakao;
}