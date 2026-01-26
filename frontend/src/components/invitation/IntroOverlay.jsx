import React, { useEffect, useState } from 'react';

const IntroOverlay = ({ onDone }) => {
  const [exit, setExit] = useState(false);

  const ENTER = 1000;
  const HOLD = 400;
  const EXIT = 600;

  useEffect(() => {
    const t1 = setTimeout(() => setExit(true), ENTER + HOLD);
    const t2 = setTimeout(onDone, ENTER + HOLD + EXIT);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className={`intro ${exit ? 'exit' : ''}`}>
      <div className="logo" />
    </div>
  );
};

export default IntroOverlay;
