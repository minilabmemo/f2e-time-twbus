
import { NavLink, useParams } from 'react-router-dom';
import { ActionType, Dict, URI_SEARCH_DEFAULT, itemI, keyboardRouteList } from '../../utils/const';
import { ResultErrorHint } from '../../utils/error';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { cityData, getCityNameOrValue } from '../../utils/cities';
import useBusCityApi, { BusRouteResult } from '../../apis/useBusCityApi';
import { RouteItem } from '../../components/base/RouteItem';
import { StreetMap } from '../../components/base/StreetMap';


export const BusRouteSearch = () => {


  //TODO lang
  const inputRef = useRef<HTMLInputElement>(null);
  const { lang = 'defaultLang', city = 'defaultCity' } = useParams();
  let callAtInstall = true;
  if (city === URI_SEARCH_DEFAULT) {
    callAtInstall = false;
  }
  const [result] = useBusCityApi({ City: city, callAtInstall: callAtInstall });



  const [cityKeyboard, setCityKeyboard] = useState(false)

  const [routes, setRoutes] = useState(result)

  // 當回傳 result 發現變化時，更新 路線顯示
  useEffect(() => {
    setRoutes(result);
  }, [result]);


  const KeyboardCities: React.FC = () => {

    const handleCityButtonClick = () => {
      setCityKeyboard(false)
      if (inputRef.current) { //切換城市清空之前的關鍵字輸入
        inputRef.current.value = "";
      }



    };

    return (
      <>
        {cityData.map((item, index) => (


          <NavLink to={`/search/${lang}/${item.value}`} className="city-link" key={index}>
            <div

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
      <div className={`keyboard ${cityKeyboard}`}>

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

        <ResultErrorHint status={routes.status} error={routes.error} total={routes.total} />

        {result.isLoading && (<div className='result-loading'> <div className='spinner'></div></div>)}
        {(routes.status === 200) && (
          <div>
            {routes.records.map((item, index) => (
              <RouteItem key={index} item={item} lang={lang} />
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
        <div className='result-map'>
          {/* TODO 根據縣市去做顯示城市站點們 */}
          <StreetMap id="street-map-init"
            initZoom={8}
            activeTab={0}
            flyToUserLoc={false}
          />
        </div>

      </section>

    </ div>
  );
};


