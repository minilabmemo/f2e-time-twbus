
import { NavLink, useParams } from 'react-router-dom';
import { ActionType, Dict, LangType, URI_SEARCH_DEFAULT, itemI, keyboardRouteList } from '../utils/const';
import { faHeart, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { cityData, getCityNameOrValue } from '../utils/cities';
import useBusApi from '../hooks/useBusApi';
import SaveSvg from '../components/Icons/SaveSvg';


export const BusRouteSearch = () => {


  const SaveIcon = <SaveSvg width="21px" height="21px" />;



  const inputRef = useRef<HTMLInputElement>(null);
  const { lang, city } = useParams();
  let callAtInstall = true;
  if (city === URI_SEARCH_DEFAULT) {
    callAtInstall = false;
  }

  const [result, fetchData] = useBusApi({ City: city, callAtInstall: callAtInstall });
  console.log("🚀 ~ file: BusRouteSearch.tsx:13 ~ BusRouteSearch ~ result:", result)
  console.log(lang, city);//TODO lang

  const [cityKeyboard, setCityKeyboard] = useState(false)



  const KeyboardCities: React.FC = () => {

    const handleButtonClick = () => {
      setCityKeyboard(false)
      fetchData()
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


  function RoutesResult() {
    return (
      <div className='result-routes'>
        {(result.status === 404) ? <div className='err-404'> 找不到資料，請稍後再試。</div>
          : ''}
        {(result.status === 200) && (
          <div>
            {result.records.map((item, index) => (
              <>
                <div
                  key={index}
                  className='route'
                // onClick={() => handleButtonClick(item)}
                >
                  <div className="route-info" >
                    <div className='route-name'> {lang === LangType.en ? (item.RouteName.En) : (item.RouteName.Zh_tw)} </div>
                    <div className='route-direction'>
                      {lang === LangType.en ? (`${item.DepartureStopNameEn} - ${item.DestinationStopNameEn}`) : (`${item.DepartureStopNameZh} - ${item.DestinationStopNameZh}`)}

                    </div>
                  </div>
                  <div className="route-action" >
                    <div className='save-icon'>{SaveIcon}</div>
                    <div className='route-city'> {getCityNameOrValue(item.City, lang)}</div>
                  </div>
                </div>

                <div className='gray-line'></div>
              </>
            ))}

          </div>
        )}


      </div>
    );
  }
  return (
    <div className='search'>
      <section className='search-header'>
        <div className='breadcrumb'> 首頁/ {getCityNameOrValue(city, lang)}</div>



        <div className='timetable'>{Dict.timetable[lang as keyof typeof Dict.timetable]}</div>
      </section>

      <section className='search-main'>
        <div className='sidebar'>
          <input placeholder='請輸入關鍵字或使用鍵盤輸入站名' ref={inputRef}>
            {/* TODO query icon */}
          </input>
          <RoutesResult />

          <Keyboard city={city} />
        </div>
        <div className='result-map'></div>

      </section>

    </ div>
  );
};


