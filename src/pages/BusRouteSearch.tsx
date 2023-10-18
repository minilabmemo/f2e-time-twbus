
import { NavLink, useParams } from 'react-router-dom';
import { ActionType, Dict, LangType, URI_SEARCH_DEFAULT, itemI, keyboardRouteList } from '../utils/const';
import { faHeart, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { cityData, getCityNameOrValue } from '../utils/cities';
import useBusApi, { BusRouteResult } from '../hooks/useBusApi';
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

  console.log(lang, city);//TODO lang

  const [cityKeyboard, setCityKeyboard] = useState(false)

  const [routes, setRoutes] = useState(result)

  // 当 result 发生变化时，更新 routes
  useEffect(() => {
    setRoutes(result);
  }, [result]);


  const KeyboardCities: React.FC = () => {

    const handleCityButtonClick = () => {
      setCityKeyboard(false)
      if (inputRef.current) { //切換城市清空之前的關鍵字輸入
        inputRef.current.value = "";
      }
      fetchData()


    };

    return (
      <>
        {cityData.map((item, index) => (


          <NavLink to={`/search/${lang}/${item.value}`} className="city-link">
            <div
              key={index}
              className='btn btn-blue'
              onClick={() => handleCityButtonClick()}
            >
              {item.name}
            </div>
          </NavLink>
        ))}
      </>
    );
  };

  const KeyboardRoutes: React.FC = () => {

    const handleRouteButtonClick = (item: itemI) => {

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
        handleInputChange();
      }
    };

    return (
      <>
        {keyboardRouteList.map((item, index) => (
          <div
            key={index}
            className={item.attr}
            onClick={() => handleRouteButtonClick(item)}
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


  function RoutesResult({ routes }: { routes: BusRouteResult }) {
    return (
      <div className='result-routes'>
        {(routes.status === 404) ? <div className='err-404'> 找不到資料，請稍後再試。</div>
          : ''}
        {(routes.status === 200) && (routes.total === 0) && <div className='err-404'> 無此路線，請輸入其他關鍵字。</div>}
        {(routes.status !== 200) && (routes.status !== 0) && <div className='err-404'> Ops..遇到了問題，請稍後再試。</div>}

        {(routes.status === 200) && (
          <div>
            {routes.records.map((item, index) => (
              <div key={index}>
                <div
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
              </div>
            ))}

          </div>
        )}


      </div>
    );
  }

  //TODO 這邊只有查詢起點終點 應該要有中間的站名才是
  function filterRecords({ input, data }: { input: string, data: BusRouteResult }) {
    const filteredRecords = data.records.filter((record) => {

      const { RouteName, DepartureStopNameZh, DestinationStopNameZh } = record; //TODO lang
      return (
        RouteName.Zh_tw.includes(input) ||
        DepartureStopNameZh.includes(input) ||
        DestinationStopNameZh.includes(input)
      );
    });



    return {
      records: filteredRecords,
      status: data.status,
      total: filteredRecords.length, // 更新总记录数
      isLoading: data.isLoading,
    };
  }
  const handleInputChange = () => {
    if (inputRef.current) {
      const inputValue = inputRef.current.value;
      if (inputValue === "") {
        setRoutes(result);
      } else {

        const res = filterRecords({ input: inputValue, data: result });
        setRoutes(res);
      }



    }
  };
  return (
    <div className='search'>
      <section className='search-header'>
        <div className='breadcrumb'> 首頁/ {getCityNameOrValue(city, lang)}</div>



        <div className='timetable'>{Dict.timetable[lang as keyof typeof Dict.timetable]}</div>
      </section>

      <section className='search-main'>
        <div className='sidebar'>
          <input placeholder='請輸入關鍵字或使用鍵盤輸入站名' ref={inputRef} onChange={() => handleInputChange()}>
            {/* TODO query icon */}
          </input>
          <RoutesResult routes={routes} />

          <Keyboard city={city} />
        </div>
        <div className='result-map'></div>

      </section>

    </ div>
  );
};


