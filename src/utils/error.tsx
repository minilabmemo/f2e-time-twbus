

export const ResultErrorHint = ({ status, error, total }: { status: number | undefined, error: string | undefined, total: number }) => {

  if (status === 429) {
    return <div className='err-hint'>請求已達上限，請明日再試。</div>;
  }
  if (error) {

    if (error.includes(" is not accepted but Taipei, Tainan, NewTaipei, Taoyuan, Taichung")) {
      return <div className='err-hint'>路線站點動態資訊，目前後端資料城市只支援台北/台南/新北/桃園/台中，請選擇其他城市。</div>;
    }

    return <div className='err-hint'>Ops..遇到了錯誤，請稍後再試。{error}</div>;
  }
  if (status === 404) {
    return <div className='err-hint'>找不到資料，請稍後再試。</div>;
  }
  if (status === 200 && total === 0) {
    return <div className='err-hint'>無此路線，請輸入其他關鍵字。</div>;
  }
  if (status !== 200 && status !== 0) {
    return <div className='err-hint'>Ops..遇到了問題，請稍後再試。</div>;
  }



  return null;
};