
import { useParams } from 'react-router-dom';
import { Dict } from '../../utils/const';
import { ResultErrorHint } from '../../utils/error';
import to_loc from '../../images/to_loc.svg';
import { useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import { getUserLocation } from '../../utils/gps';
import useBusStopsNearByApi, { BusStationResult } from '../../apis/useBusStopsNearByApi';

export const BusRouteStopsNearBy = () => {
  const { lang = 'defaultLang' } = useParams();//TODO lang
  const [filter, setFilter] = useState("")

  function NearByResultByLocation({ spatialFilter }: { spatialFilter: string }) {
    const [result] = useBusStopsNearByApi({ filter: spatialFilter, callAtInstall: true });

    return (
      <div>
        {result.isLoading && (<div className='result-loading'> <div className='spinner'></div></div>)}

        <NearByResult result={result} />

      </div>
    )
  }

  useEffect(() => {
    const userFetchData = async () => {
      const userLocation = await getUserLocation();
      const spatialFilter = `nearby(${userLocation?.userLat}, ${userLocation?.userLng}, 1000)`;
      setFilter(spatialFilter)
    }
    userFetchData()
  }, [])

  //TODO 詳細路線串接待確認  距離如何計算也待確認
  function NearByResult({ result }: { result: BusStationResult }) {

    return (
      <div className='result-body'>
        <ResultErrorHint status={result.status} error={result.error} total={result.total} />

        {(result.status === 200) && (
          <div className="result-stations">
            {result.records.map((item, index) => (
              <div key={index}>
                <span key={index} className='station' onClick={() => { alert("詳細資訊，後端資訊尚未完成，請至站點查詢。") }}>
                  <div className='station-info'>
                    <div className='station-name'> {item.StationName.Zh_tw}</div>
                    <div className='station-stop-num'> {item.Stops.length}個路線</div>
                  </div>
                  <div className='station-far'>
                    41m
                  </div>


                </span>
                <div className='gray-line'></div>
              </div>


            ))}

          </div>
        )
        }
      </div >
    );
  }
  return (
    <div className='search'>
      <section className='search-header'>
        <div className='breadcrumb'> 首頁/附近站點</div>

        <div className='timetable'>{Dict.timetable[lang as keyof typeof Dict.timetable]}</div>
      </section>

      <section className='search-main'>
        <div className='sidebar'>
          <div className="link-container">
            {/* <NavLink to={calculateSearchURL({ lang, city, })} className="return-search-link">
              <FontAwesomeIcon icon={faChevronLeft} className='icon' /> 返回搜尋
            </NavLink > */}

          </div>

          {(filter !== "") ? (<NearByResultByLocation spatialFilter={filter}></NearByResultByLocation>) :
            (<div className='result-loading'> <div className='spinner'></div></div>)
          }

        </div>

        <div className='result-map'>

          {/* {result.isLoading ? "loading...." : (<LeafletMap id="street-map" />)} */}
          {/* //TODO 更新站點的title不是整個地圖才是 */}
          {/* <StreetMap id="street-map"
            stops={result.results?.BusStopOfRoutes[activeTab].Stops}
            busN1EstimateTimes={result.results?.BusN1EstimateTimes}
            activeTab={activeTab}
          /> */}



        </div>

      </section >

    </ div >
  );
};



