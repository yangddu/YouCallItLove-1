import { useEffect, useRef } from 'react';
import { useSessionContext } from '@hooks/useSession';
import { useAlert } from '@/hooks/useAlert';
import { fetchApi } from '@/feature/api/fetchApi';

const AuthCallback = () => {
  const { update } = useSessionContext();
  const showAlert = useAlert();
  const isFetched = useRef(false);

  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;
    (async () => {
      try {
        await fetchApi('/api/auth/kakao/refresh', 'POST');
        await update();

        window.location.replace('/test-202512?write=true');
      } catch (e) {
        showAlert({
          message: '로그인 세션이 만료되었습니다.\n다시 로그인 해주세요.',
          type: 'error',
          buttonText: '확인',
          onConfirm: () => {
            window.location.replace('/login');
          },
        });
      }
    })();
  }, []);

  return <div className="login-session">로그인 처리 중이에요...</div>;
};

export default AuthCallback;
