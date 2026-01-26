import React, { useState } from 'react';
import { useAlert } from '@/hooks/useAlert';
import '@styles/AccountSection.css';

const AccountSection = () => {
  const [expanded, setExpanded] = useState({ groom: false, bride: false });
  const showAlert = useAlert();

  const toggleSection = (type) => {
    setExpanded((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showAlert({
        message: `계좌번호가 복사되었습니다.`,
        type: 'default',
        closeOnOverlayClick: true,
      });
    });
  };

  const accountData = {
    groom: [
      {
        relation: '신랑',
        owner: '김철수',
        bank: '신한은행',
        number: '123-4567-8901',
      },
      {
        relation: '신랑 아버지',
        owner: '김정민',
        bank: '신한은행',
        number: '234-5678-9012',
      },
      {
        relation: '신랑 어머니',
        owner: '이민숙',
        bank: '신한은행',
        number: '345-6789-0123',
      },
    ],
    bride: [
      {
        relation: '신부',
        owner: '이민지',
        bank: '신한은행',
        number: '987-6543-2109',
      },
      {
        relation: '신부 아버지',
        owner: '이준호',
        bank: '신한은행',
        number: '876-5432-1098',
      },
      {
        relation: '신부 어머니',
        owner: '김수미',
        bank: '신한은행',
        number: '765-4321-0987',
      },
    ],
  };

  return (
    <div className="account-container-dark">
      <div className="account-header">
        <h2>마음 전하실 곳</h2>
        <p>
          참석이 어려우신 분들을 위해 계좌번호를 기재하였습니다.
          <br />
          너그러운 마음으로 양해 부탁드립니다.
        </p>
      </div>

      <div className="account-accordion-group">
        {['groom', 'bride'].map((type) => (
          <div key={type} className="accordion-item">
            <div
              className="accordion-header"
              onClick={() => toggleSection(type)}
            >
              <span>
                {type === 'groom'
                  ? '신랑측 계좌번호 확인하기'
                  : '신부측 계좌번호 확인하기'}
              </span>
              <span className={`icon ${expanded[type] ? 'close' : 'open'}`}>
                {expanded[type] ? '✕' : '···'}
              </span>
            </div>
            {expanded[type] && (
              <div className="accordion-content">
                {accountData[type].map((item, idx) => (
                  <div key={idx} className="account-row">
                    <div className="account-main">
                      <span className="relation">{item.relation}</span>
                      <div className="details">
                        <span className="owner">{item.owner}</span>
                        <span className="bank-info">
                          {item.number} {item.bank}
                        </span>
                      </div>
                    </div>
                    <button
                      className="copy-btn"
                      onClick={() => handleCopy(item.number)}
                    >
                      복사하기
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountSection;
