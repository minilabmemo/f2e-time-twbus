
import { useParams } from 'react-router-dom';
import { Dict } from '../../utils/const';
import { getRoutesLiked } from '../../utils/localStorages/routelikes';
import { RouteItem } from '../../components/base/RouteItem';
import { StreetMap } from '../../components/base/StreetMap';
import { useState } from 'react';



export const BusRouteSave = () => {

  const { lang = 'defaultLang' } = useParams();
  const routesLiked = getRoutesLiked();
  const [activeTab, setActiveTab] = useState(0)
  return (
    <div className='search'>
      <section className='search-header'>
        <div className='breadcrumb'> 首頁/ 收藏路線</div>

      </section>

      <section className='save-main'>
        <div className='result-routes-save'>
          <div className="tab-buttons">
            <button
              className={`tab-button ${activeTab === 0 ? 'active' : 'inactive'}`}

              onClick={() => setActiveTab(0)}
            >
              收藏路線
            </button>
            <button
              className={`tab-button ${activeTab === 1 ? 'active' : 'inactive'}`}

              onClick={() => setActiveTab(1)}
            >
              收藏站點
            </button>
          </div>

          <div className="tab-contents" >
            {activeTab === 0 && (
              <div className="tab-content active" >
                {routesLiked.map((item, index) => (
                  <div key={index}>
                    <RouteItem key={index} item={item} lang={lang} />
                  </div>

                ))}
              </div>
            )}
            {activeTab === 1 && (
              <div className="tab-content" >
                尚未完成
              </div>
            )}
          </div>
        </div>


      </section >


    </ div >
  );
};


