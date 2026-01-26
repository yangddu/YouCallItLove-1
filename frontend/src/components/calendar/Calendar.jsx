import React, { useState, useEffect } from 'react';
import '@styles/Calendar.css';

const CalendarSection = () => {
  const weddingDate = new Date('2026-02-13T15:30:30');
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +weddingDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = [31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  return (
    <section className="calendar-container">
      <div className="calendar-month">2</div>

      <div className="calendar-grid">
        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day === 13 ? 'wedding-day' : ''}`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="countdown-timer">
        {timeLeft.days} : {String(timeLeft.hours).padStart(2, '0')} :{' '}
        {String(timeLeft.minutes).padStart(2, '0')} :{' '}
        {String(timeLeft.seconds).padStart(2, '0')}
      </div>

      <p className="countdown-label">DAYS UNTIL THE WEDDING</p>
    </section>
  );
};

export default CalendarSection;
