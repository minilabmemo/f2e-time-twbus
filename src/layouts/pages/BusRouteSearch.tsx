
import { NavLink, useParams } from 'react-router-dom';
import { ActionType, Dict, URI_SEARCH_DEFAULT, itemI, keyboardRouteList } from '../../utils/const';
import { phone_media } from '../../utils/media_query';
import { ResultErrorHint } from '../../utils/error';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { cityData, getCityNameOrValue } from '../../utils/cities';
import useBusCityApi, { BusRouteResult } from '../../apis/useBusCityApi';
import { RouteItem } from '../../components/base/RouteItem';
import { StreetMap } from '../../components/base/StreetMap';
import { useMediaQuery } from "@uidotdev/usehooks";
import map_icon from "../../images/map.svg"


export const BusRouteSearch = () => {

  const isSmallDevice = useMediaQuery(phone_media);

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
  const [phoneMapOpen, setMapOpen] = useState(false)
  console.log("🚀 ~ file: BusRouteSearch.tsx:33 ~ BusRouteSearch ~ phoneMapOpen:", phoneMapOpen)
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
      <>
        <div className='result-routes'>

          <ResultErrorHint status={routes.status} error={routes.error} total={routes.total} />

          {result.isLoading && (<div className='result-loading'> <div className='spinner'></div></div>)}
          {(routes.status === 200) && (
            <div >
              {routes.records.map((item, index) => (
                <RouteItem key={index} item={item} lang={lang} />
              ))}

            </div>
          )}


        </div>
      </>
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
    <div className='content'>
      <section className='content-header'>
        <div className='breadcrumb'> 首頁/ {getCityNameOrValue(city, lang)}</div>

        {isSmallDevice ? (
          <div className='mapBtn' onClick={() => setMapOpen(!phoneMapOpen)}>
            <img src={map_icon} alt="map_icon" className='icon' />
            {Dict.map[lang as keyof typeof Dict.map]}</div>
        ) : (<div className='timetable'>{Dict.timetable[lang as keyof typeof Dict.timetable]}</div>)}
      </section>

      <section className={`content-main ${isSmallDevice ? 'small' : ''}`}>
        <div className={`sidebar ${phoneMapOpen ? 'hidden' : ""}`}>
          <input placeholder='請輸入關鍵字或使用鍵盤輸入站名' ref={inputRef} onChange={() => handleInputChange()}>

          </input>  {/* TODO query icon */}

          <RoutesResult routes={routes} />

          <Keyboard city={city} />
        </div>
        {phoneMapOpen && (<div className='result-map phone'>
          {/* TODO 根據縣市去做顯示城市站點們 */}
          <StreetMap id="street-map-routes-phone"
            initZoom={8}
            activeTab={0}
            flyToUserLoc={false}
          />
        </div>)}

        {isSmallDevice || (<div className='result-map'>
          {/* TODO 根據縣市去做顯示城市站點們 */}
          <StreetMap id="street-map-routes"
            initZoom={8}
            activeTab={0}
            flyToUserLoc={false}
          />
        </div>)}


      </section>

    </ div>
  );
};


