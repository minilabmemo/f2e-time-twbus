import { useEffect, useState, useRef } from "react";
import refresh_now from '../../images/icons8_refresh.svg';

// 程式碼功能如下：
// 1.從initialCountdown開始倒數，每一秒減一，到0時發送一次refreshAction，並重新開始倒數
// 例如initialCountdown=5，就顯示5,4,3,2,1,0，到0時發送一次refreshAction，並重新開始倒數顯示5,4,3,2,1,0
// 2.按下立即更新就立即發送一次refreshAction，並重新設定成initialCountdown重新倒數
// 不管現在倒數到哪了，按下後發送一次refreshActio，重新開始倒數顯示5,4,3,2,1,0

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
