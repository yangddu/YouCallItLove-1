import { useContext } from 'react';
import { SessionContext } from '@contexts/SessionContext';

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error(
      'useSessionContext는 SessionContextProvider 내부에서 사용해야 합니다.',
    );
  }
  return context;
}
