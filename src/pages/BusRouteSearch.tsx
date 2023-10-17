
import { useParams } from 'react-router-dom';
import { ActionType, Dict, itemI, keyboardList } from '../utils/const';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import { Console } from 'console';


export const BusRouteSearch = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { lang, city } = useParams();

  console.log(lang, city);


  const KeyboardBtn: React.FC = () => {



    const handleButtonClick = (item: itemI) => {

      if (inputRef.current) {
        if (item.action === ActionType.delete) {
          const currentValue = inputRef.current.value;
          if (currentValue.length > 0) {
            inputRef.current.value = currentValue.slice(0, -1);
          }

        } else if (item.action === ActionType.clear) {
          inputRef.current.value = "";

        } else {
          inputRef.current.value += item.zh;

        }

      }
    };

    return (
      <>
        {keyboardList.map((item, index) => (
          <div
            key={index}
            className={item.attr}
            onClick={() => handleButtonClick(item)}
          >
            {item.zh}
          </div>
        ))}
      </>
    );
  };

  function Keyboard({ city }: { city: string | undefined }) {
    return (
      <div className='keyboard'>
        <div className='city'>
          <FontAwesomeIcon icon={faLocationDot} />  請先選擇城市
        </div>
        <div className='routes'>
          <KeyboardBtn />
        </div>
      </div>
    );
  }

  return (
    <div className='search'>
      <section className='search-header'>
        <div className='breadcrumb'> 首頁/</div>



        <div className='timetable'>{Dict.timetable[lang as keyof typeof Dict.timetable]}</div>
      </section>

      <section className='search-main'>
        <div className='sidebar'>
          <input placeholder='請輸入關鍵字或使用鍵盤輸入站名' ref={inputRef}>
            {/* TODO query icon */}
          </input>
          <div className='result-routes'>

          </div>

          <Keyboard city={city} />
        </div>
        <div className='result-map'></div>

      </section>

    </ div>
  );
};


