import React, { useState, useEffect, useMemo } from 'react';
import '@styles/Calendar.css';

const CalendarSection = ({ weddingDate: weddingDateStr = '2026-02-13T15:30:30' }) => {
  const weddingDate = useMemo(() => new Date(weddingDateStr), [weddingDateStr]);

  const calculateTimeLeft = () => {
    const difference = +weddingDate - +new Date();
    if (difference <= 0) return null;
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      const next = calculateTimeLeft();
      setTimeLeft(next);
      if (!next) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  const month = weddingDate.getMonth() + 1;
  const weddingDay = weddingDate.getDate();
  const startDay = new Date(weddingDate);
  startDay.setDate(weddingDay - 13);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
    return d.getDate();
  });

  return (
    <section className="calendar-container">
      <div className="calendar-month">{month}</div>

      <div className="calendar-grid">
        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day === weddingDay ? 'wedding-day' : ''}`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="countdown-timer">
        {timeLeft ? (
          <>
            {timeLeft.days} : {String(timeLeft.hours).padStart(2, '0')} :{' '}
            {String(timeLeft.minutes).padStart(2, '0')} :{' '}
            {String(timeLeft.seconds).padStart(2, '0')}
          </>
        ) : (
          'Today!'
        )}
      </div>

      <p className="countdown-label">DAYS UNTIL THE WEDDING</p>
    </section>
  );
};

export default CalendarSection;
