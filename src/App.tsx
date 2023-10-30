

import { Header } from './layouts/header';
import PetFinder from './layouts/pages/CityBusHome';
import { Footer } from './layouts/Footer';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { URI_NEARBY_DEFAULT, URI_PET_FIND_PREFIX, URI_SAVE_DEFAULT, URI_SEARCH, URI_STOPS } from './utils/const';
import { Wait } from './components/Wait';
import { BusRouteSearch } from './layouts/pages/BusRouteSearch';
import { BusRouteStops } from './layouts/pages/BusRouteStops';
import { BusRouteStopsNearBy } from './layouts/pages/BusRouteStopsNearBy';
import { BusRouteSave } from './layouts/pages/BusRouteSave';


const BaseLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="base">
    <div className="container">
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  </div>
);

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<BaseLayout><PetFinder /></BaseLayout>} />
        <Route path={`${URI_NEARBY_DEFAULT}`} element={<BaseLayout><BusRouteStopsNearBy /></BaseLayout>} />
        <Route path={`${URI_SEARCH}`} element={<BaseLayout><BusRouteSearch /></BaseLayout>} />
        <Route path={`${URI_STOPS}`} element={<BaseLayout><BusRouteStops /></BaseLayout>} />
        <Route path={`${URI_SAVE_DEFAULT}`} element={<BaseLayout><BusRouteSave /></BaseLayout>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
