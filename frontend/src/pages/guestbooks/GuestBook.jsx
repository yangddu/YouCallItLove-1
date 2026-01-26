import React, { useState, useEffect, useCallback } from 'react';
import { useSessionContext } from '@hooks/useSession';
import { useAlert } from '@/hooks/useAlert';
import { fetchApi } from '@/feature/api/fetchApi';
import '@styles/GuestWriteForm.css';

const MAX_LENGTH = 200;
const NAME_MAX_LENGTH = 10;

const GuestWriteForm = ({ isOpen, onClose, onSuccess, invitationId }) => {
  const { status } = useSessionContext();
  const isIdentified = status === 'authenticated';
  const showAlert = useAlert();

  const [formData, setFormData] = useState({
    name: '',
    message: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setFormData({ name: '', message: '', password: '' });
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.message.trim())
      return showAlert({ message: '메시지를 입력해주세요.', type: 'default' });

    // if (!isIdentified && !formData.password.trim())
    //   return showAlert({
    //     message: '비밀번호를 입력해주세요.',
    //     type: 'default',
    //   });

    setIsSubmitting(true);
    try {
      const payload = {
        invitationId: invitationId,
        name: formData.name,
        message: formData.message,
        ...(!isIdentified && { password: formData.password }),
      };

      const res = await fetchApi('/api/guestbook/write', 'POST', {
        body: payload,
        withCredentials: true,
      });
      if (res.data.success) {
        showAlert({
          message: '축하해주셔서 감사합니다.\n소중히 읽어볼게요.',
          content: '💌',
          type: 'success',
        });
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error(error);
      showAlert({
        message: '등록 중 오류가 발생했습니다.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>축하 메시지 남기기</h3>
          <button type="button" className="close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} className="write-form">
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            maxLength={NAME_MAX_LENGTH}
            placeholder="이름"
            required
          />

          <div className="input-group">
            <textarea
              name="message"
              placeholder="이곳에 내용을 입력해주세요..."
              value={formData.message}
              onChange={handleChange}
              maxLength={MAX_LENGTH}
              required
            />
            <div className="char-count">
              {formData.message.length} / {MAX_LENGTH}
            </div>
          </div>

          {/* {!isIdentified && (
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호"
              className="password-input"
              required
            />
          )} */}

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting || !formData.message.trim()}
          >
            {isSubmitting ? '등록 중' : '등록하기'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GuestWriteForm;
