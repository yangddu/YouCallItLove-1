import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/feature/api/fetchApi';
import '@styles/GuestListModal.css';

const GuestListModal = ({ isOpen, onClose }) => {
  const [guestList, setGuestList] = useState([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const loadData = async () => {
        try {
          const res = await fetchApi(`/api/guestbook?slug=test-202512`, 'GET');
          setGuestList(res.data.data);
        } catch (e) {
          console.error(e);
        }
      };

      loadData();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content guest-list-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header guest-list-header">
          <div className="header-title">
            <h3>소중한 마음들</h3>
            <span className="count-tag">Total {guestList.length}</span>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body guest-list-body">
          {guestList.length > 0 ? (
            <div className="guest-list">
              {guestList.map((item) => (
                <div key={item.id} className="guest-card">
                  <div className="card-top">
                    <span className="guest-name">{item.name}</span>
                    <span className="guest-date">
                      {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <div className="card-content">{item.message}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>아직 작성된 축하 메시지가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestListModal;
