import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchApi } from '@/feature/api/fetchApi';

export const SessionContext = createContext(undefined);

export const SessionContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('unauthenticated');

  const resetSession = useCallback(() => {
    setSession(null);
    setStatus('unauthenticated');
  }, []);

  const updateSession = useCallback(async () => {
    try {
      const res = await fetchApi('/api/auth/me', 'GET');
      const userData = res.data?.data;

      if (userData) {
        setSession(userData);
        setStatus('authenticated');
        return userData;
      } else {
        resetSession();
        return null;
      }
    } catch (error) {
      if (error.status === 401) {
        console.warn('현재 비로그인 상태입니다.');
      } else {
        console.error('세션 업데이트 실패:', error);
      }
      resetSession();
      return null;
    }
  }, [resetSession]);

  useEffect(() => {
    updateSession();
  }, [updateSession]);

  const value = useMemo(
    () => ({
      data: session,
      status: status,
      update: updateSession,
      reset: resetSession,
    }),
    [session, status, updateSession, resetSession],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
