import { useEffect, useState, useRef } from "react";
import refresh_now from '../../images/icons8_refresh.svg';

export function RefreshBar({ initialCountdown, refreshAction, updateTime }: { initialCountdown: number, refreshAction: () => void, updateTime: string | undefined }) {
  const [countdown, setCountdown] = useState(initialCountdown);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = () => {
    setCountdown(initialCountdown);

    countdownTimerRef.current = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
  };

  const handleRefresh = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current as NodeJS.Timeout);
    }
    setCountdown(initialCountdown);
    refreshAction();
    startCountdown();
  };

  useEffect(() => {
    startCountdown();

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current as NodeJS.Timeout);
      }
    };
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current as NodeJS.Timeout);
      }
      refreshAction();
      startCountdown();
    }
  }, [countdown, refreshAction]);

  function extractTimeFromDateTime(dateTimeString: string | undefined) {
    if (dateTimeString) {
      var indexOfT = dateTimeString.indexOf('T');
      if (indexOfT !== -1) {
        return dateTimeString.substr(indexOfT + 1, 8);
      }
    }
  }

  return (
    <div className='refresh-bar'>
      <div style={{ width: `${(countdown / initialCountdown) * 100}%` }} className='countdown-line'></div>
      <div className='refresh-box'>
        <div className="count">{countdown} 秒後更新</div>
        <button onClick={handleRefresh}>
          <img src={refresh_now} alt="refresh_now" className='icon' /> 立即更新 {extractTimeFromDateTime(updateTime)}
        </button>
      </div>
    </div>
  );
}
