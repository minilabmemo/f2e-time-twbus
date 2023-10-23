import { useEffect, useState } from "react";
import refresh_now from '../../images/icons8_refresh.svg';
export function RefreshBar({ initialCountdown, refreshAction, updateTime }: { initialCountdown: number, refreshAction: () => void, updateTime: string | undefined }) {

  const [countdown, setCountdown] = useState(initialCountdown);
  const startCountdown = () => {
    setCountdown(initialCountdown); // 重置
    const countdownTimer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownTimer);
    }, initialCountdown * 1000);
  };
  useEffect(() => {
    startCountdown(); // 组件加載後就開始倒數
  }, []);
  useEffect(() => {
    if (countdown === 0) {
      refreshAction();
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
      <div style={{ width: `${(countdown / initialCountdown) * 100}%` }} className='countdown-line'> </div>
      <div className='refresh-box'>
        <div className="count">{countdown} 秒後更新</div>

        <div className="button" onClick={() => refreshAction()}>  <img src={refresh_now} alt="refresh_now" className='icon' /> 立即更新 {extractTimeFromDateTime(updateTime)}</div>
      </div>

    </div >
  )
}
