
import { NavLink, useParams } from 'react-router-dom';
import { ActionType, Dict, URI_SEARCH_DEFAULT, itemI, keyboardRouteList } from '../utils/const';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { cityData, getCityNameOrValue } from '../utils/cities';


export const BusRouteSearch = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { lang, city } = useParams();

  console.log(lang, city);//TODO lang

  const [cityKeyboard, setCityKeyboard] = useState(false)



  const KeyboardCities: React.FC = () => {

    const handleButtonClick = () => {
      setCityKeyboard(false)

    };

    return (
      <>
        {cityData.map((item, index) => (


          <NavLink to={`/query/${lang}/${item.value}`} className="city-link">
            <div
              key={index}
              className='btn btn-blue'
              onClick={() => handleButtonClick()}
            >
              {item.name}
            </div>
          </NavLink>
        ))}
      </>
    );
  };

  const KeyboardRoutes: React.FC = () => {

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
        {keyboardRouteList.map((item, index) => (
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

        {(city === URI_SEARCH_DEFAULT) ? (
          <div className='city-option' onClick={() => setCityKeyboard(true)}>
            <FontAwesomeIcon icon={faLocationDot} className='icon' />  請先選擇城市
          </div>)
          : (
            <div className='city-option' onClick={() => setCityKeyboard(true)}>
              <FontAwesomeIcon icon={faLocationDot} className='icon' /> {getCityNameOrValue(city, lang)}
            </div>)
        }
        {(cityKeyboard) ? (

          <div className='cities-keyboard'>
            <KeyboardCities />
          </div>
        ) :
          <div className='routes'>
            {city === URI_SEARCH_DEFAULT && (
              <div className='disable_routes'>
              </div>)
            }
            <KeyboardRoutes />


          </div>}

      </div >
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


