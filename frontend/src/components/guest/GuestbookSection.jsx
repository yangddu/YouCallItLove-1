import React, { useEffect, useState, useCallback } from 'react';
import { useSessionContext } from '@hooks/useSession.js';
import { useAlert } from '@/hooks/useAlert';
import { fetchApi } from '@/feature/api/fetchApi';
import GuestWriteForm from '@/pages/guestbooks/GuestBook';
import GuestListModal from '@components/guest/GuestListModal.jsx';
import '@styles/GuestBook.css';
import { useParams } from '@tanstack/react-router';

const GuestSection = ({ invitationId }) => {
  const { slug } = useParams({ from: '/$slug' });
  const { status } = useSessionContext();
  const showAlert = useAlert();
  const [modalOpen, setModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inv, setInv] = useState(null);
  const baseUrl = import.meta.env.VITE_API_URL;

  const fetchGuestbooks = useCallback(async () => {
    try {
      const res = await fetchApi(`/api/guestbook?slug=${slug}&limit=3`, 'GET');

      if (res.data.success) {
        setInv(res.data);
        setMessages(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  }, [slug]);

  useEffect(() => {
    fetchGuestbooks();

    const handleInitialAction = () => {
      const isWriteMode =
        new URLSearchParams(window.location.search).get('write') === 'true';
      if (isWriteMode) {
        const element = document.getElementById('guestbook');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setFormModalOpen(true);
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    };

    const timer = setTimeout(handleInitialAction, 100);

    return () => clearTimeout(timer);
  }, [fetchGuestbooks]);

  const handleWriteClick = () => {
    if (status === 'authenticated') {
      setFormModalOpen(true);
      return;
    }
    if (status === 'unauthenticated') {
      sessionStorage.setItem('return_slug', slug);
      showAlert({
        message: `카카오 로그인 후 메시지를 남겨주세요!`,
        content: '🔐',
        type: 'default',
        buttonText: '로그인 하러가기',
        closeOnOverlayClick: true,
        onConfirm: () => {
          const currentPath = encodeURIComponent(window.location.href);
          window.location.href = `${baseUrl}/api/auth/kakao?redirect=${currentPath}`;
        },
      });
      return;
    }
  };
  return (
    <section className="guest-container" id="guestbook">
      <div className="guest-section-title">FROM YOUR HEART</div>
      <p className="guest-subtitle">
        새로운 시작을 함께할 신랑 신부를 위해
        <br />
        따뜻한 마음을 남겨주세요.
      </p>
      <div className="guest-list">
        {messages.map((msg) => (
          <div key={msg.id} className="guest-card">
            <div className="message-name">{msg.name}</div>
            <div className="message">{msg.message}</div>
          </div>
        ))}
      </div>

      <div className="guest-button-group">
        <button className="btn-common btn-dark" onClick={handleWriteClick}>
          작성하기
        </button>

        <button
          className="btn-common btn-dark"
          onClick={() => setModalOpen(true)}
        >
          전체보기
        </button>
      </div>

      <GuestWriteForm
        slug={slug}
        invitationId={invitationId}
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSuccess={fetchGuestbooks}
      />

      <GuestListModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messages={messages}
      />
    </section>
  );
};

export default GuestSection;
