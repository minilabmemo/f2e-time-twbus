
import { NavLink, useParams } from 'react-router-dom';
import { Dict, URI_SEARCH } from '../utils/const';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCityNameOrValue } from '../utils/cities';
import { BusRouteResult } from '../hooks/useBusCityApi';
import useBusRouteApi, { BusStopsResult } from '../hooks/useBusStopsApi';


export const BusRouteStops = () => {

  const { lang = 'defaultLang', city = 'defaultCity', route } = useParams();//TODO lang

  function calculateSearchURL({ lang, city }: { lang: string, city: string }) {
    return URI_SEARCH.replace(':lang', lang).replace(':city', city);
  }


  const [result, fetchData] = useBusRouteApi({ City: city, Route: route, callAtInstall: true });

  console.log(result);
  // const [routes, setRoutes] = useState(result)

  // 当 result 发生变化时，更新 routes
  // useEffect(() => {
  //   setRoutes(result);
  // }, [result]);


  const ErrorHint = ({ result }: { result: BusStopsResult }) => {
    if (result.status === 429) {
      return <div className='err-hint'>請求已達上限，請明日再試。</div>;
    }
    if (result.status === 404) {
      return <div className='err-hint'>找不到資料，請稍後再試。</div>;
    }
    if (result.status !== 200 && result.status !== 0) {
      return <div className='err-hint'>Ops..遇到了問題，請稍後再試。</div>;
    }
    return null;
  };

  function BusStopsResult({ result }: { result: BusStopsResult }) {
    return (
      <div className='result-routes'>

        <ErrorHint result={result} />

        {(result.status === 200) && (
          <div>
            {/* {routes.records.map((item, index) => (
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

                    <div className='route-city'> {getCityNameOrValue(item.City, lang)}</div>
                  </div>
                </div>

                <div className='gray-line'></div>
              </div>
            ))} */}

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

  return (
    <div className='search'>
      <section className='search-header'>
        <div className='breadcrumb'> 首頁/ {getCityNameOrValue(city, lang)}/{route}</div>

        <div className='timetable'>{Dict.timetable[lang as keyof typeof Dict.timetable]}</div>
      </section>

      <section className='search-main'>
        <div className='sidebar'>
          <div className="link-container">
            <NavLink to={calculateSearchURL({ lang, city, })} className="return-search-link">
              <FontAwesomeIcon icon={faChevronLeft} className='icon' /> 返回搜尋
            </NavLink >
          </div>
          <BusStopsResult result={result} />


        </div>
        <div className='result-map'></div>

      </section>

    </ div>
  );
};


