
import './style/notosanstc.css';
import './style/notosans.css';
import './style/style.css';
import { Header } from './components/layout/header';
import PetFinder from './pages/CityBusHome';
import { Footer } from './components/layout/Footer';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { URI_NEARBY_DEFAULT, URI_PET_FIND_PREFIX, URI_SEARCH, URI_STOPS } from './utils/const';
import { Wait } from './components/Wait';
import { BusRouteSearch } from './pages/BusRouteSearch';
import { BusRouteStops } from './pages/BusRouteStops';
import { BusRouteStopsNearBy } from './pages/BusRouteStopsNearBy';


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
      </Routes>
    </HashRouter>
  );
}

export default App;
