import React, { useState, useEffect } from 'react';

export default function PhoneWrapper({ children }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="desktop-container">
      <div className="phone-frame">
        {/* Status Bar */}
        <div className="phone-status-bar">
          <div className="status-time">{time || '12:00'}</div>
          <div className="status-icons">
            {/* Cellular signal */}
            <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
              <rect x="0" y="8" width="2" height="3" rx="0.5" />
              <rect x="4" y="6" width="2" height="5" rx="0.5" />
              <rect x="8" y="4" width="2" height="7" rx="0.5" />
              <rect x="12" y="2" width="2" height="9" rx="0.5" />
              <rect x="16" y="0" width="2" height="11" rx="0.5" />
            </svg>
            {/* Wifi */}
            <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
              <path d="M7.5 11C8.32843 11 9 10.3284 9 9.5C9 8.67157 8.32843 8 7.5 8C6.67157 8 6 8.67157 6 9.5C6 10.3284 6.67157 11 7.5 11Z" />
              <path d="M3.75 5.75C5.82107 3.67893 9.17893 3.67893 11.25 5.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M1.5 3.5C4.81371 0.186291 10.1863 0.186291 13.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
            {/* Battery */}
            <svg width="22" height="11" viewBox="0 0 22 11" fill="currentColor">
              <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" fill="none" stroke="currentColor" />
              <rect x="2.5" y="2.5" width="12" height="6" rx="1" />
              <path d="M20 3.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Inner App Content */}
        <div className="app-screen">
          {children}
        </div>

        {/* Bottom Home Indicator */}
        <div className="phone-home-indicator"></div>
      </div>
    </div>
  );
}
