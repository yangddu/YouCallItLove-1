/* eslint-disable react-refresh/only-export-components */
import { useState, createContext, useContext } from 'react';
import CustomAlert from '@/components/customAlert/CustomAlert';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    isOpen: false,
    message: '',
    content: null,
    type: 'default',
    buttonText: '확인',
    onConfirm: null,
  });

  const showAlert = ({
    message,
    content,
    type = 'default',
    buttonText = '확인',
    onConfirm = null,
  }) => {
    setAlert({
      isOpen: true,
      message,
      content,
      type,
      buttonText,
      onConfirm,
    });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      <CustomAlert {...alert} onClose={closeAlert} />
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
