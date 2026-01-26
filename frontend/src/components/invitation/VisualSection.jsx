import { useEffect, useMemo, useState } from 'react';
import '@styles/Intro.css';
import '@styles/VisualSection.css';

const VisualSection = () => {
  const lines = useMemo(
    () => [
      { key: 'l1', text: '철수 & 민지' },
      { key: 'l2', text: '늘 따뜻한 마음에 감사드립니다' },
    ],
    [],
  );

  const ENTER_EACH = 850;
  const GAP = 120;
  const HOLD_AFTER_ALL = 350;

  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const total =
      (lines.length - 1) * (ENTER_EACH + GAP) + ENTER_EACH + HOLD_AFTER_ALL;

    const t = window.setTimeout(() => setReveal(true), total);
    return () => window.clearTimeout(t);
  }, [lines.length]);

  return (
    <section className="visual">
      <div className={`stage ${reveal ? 'reveal' : ''}`}>
        <div className="bg bg-photo" />
        <div className="bg bg-color" />

        <div className={`introWrap ${reveal ? 'hide' : ''}`}>
          {lines.map((l, idx) => (
            <div
              key={l.key}
              className="line"
              style={{
                animationDelay: `${idx * (ENTER_EACH + GAP)}ms`,
                animationDuration: `${ENTER_EACH}ms`,
              }}
            >
              {l.text}
            </div>
          ))}
          <div className="intro-upper-info">
            CHEOL SU
            <br />
            MIN JI
          </div>
          <div className="intro-bottom-info">
            2026. 06. 13 SAT 15:30
            <br />
            Western BENNEVIS
          </div>
        </div>

        <div className={`afterInfo ${reveal ? 'show' : ''}`}>
          <div className="afterInfo-image"></div>
          <div className="invitation-info">
            <div className="invitation-info-en">Cheol Su And Min Ji</div>
            <div className="invitation-info-kr">
              2026. 06. 13 SAT 15:30
              <br />
              Western BENNEVIS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualSection;
