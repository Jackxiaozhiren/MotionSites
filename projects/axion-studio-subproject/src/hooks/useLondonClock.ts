import { useState, useEffect } from 'react';

export function useBeijingClock() {
  const [time, setTime] = useState(() =>
    new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Shanghai',
      hour12: false,
    }).format(new Date())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Intl.DateTimeFormat('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Shanghai',
          hour12: false,
        }).format(new Date())
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}
