
import { useParams } from 'react-router-dom';
export const BusRouteSearch = () => {

  const { lang, city } = useParams();

  console.log(lang, city);

  return (
    <>
      <section>
        <div className='Breadcrumb'> 首頁/</div>


      </section>

    </ >
  );
};


