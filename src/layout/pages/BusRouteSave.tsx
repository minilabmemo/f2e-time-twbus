
import { useParams } from 'react-router-dom';
import { Dict } from '../../utils/const';
import { getRoutesLiked } from '../../utils/localStorages/routelikes';
import { RouteItem } from '../../components/base/RouteItem';



export const BusRouteSave = () => {

  const { lang = 'defaultLang' } = useParams();
  const routesLiked = getRoutesLiked();




  return (
    <div className='search'>
      <section className='search-header'>
        <div className='breadcrumb'> 首頁/ 收藏路線</div>
        <div className='timetable'>{Dict.timetable[lang as keyof typeof Dict.timetable]}</div>
      </section>

      <section className='search-main'>
        <div className='sidebar'>
          <div className='result-routes-save'>
            {routesLiked.map((item, index) => (
              <div>
                <RouteItem key={index} item={item} lang={lang} />
              </div>

            ))}
          </div>
        </div>
        <div className='result-map'>


        </div>

      </section>

    </ div>
  );
};


