
import './style/notosanstc.css';
import './style/notosans.css';
import './style/style.css';
import { Header } from './components/layout/header';
import PetFinder from './pages/CityBusHome';
import { Footer } from './components/layout/Footer';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { About } from './components/News';
import Stores from './components/Stores';
import PetDetailsPage from './components/PetDetailsPage';
import { URI_PET_FIND_PREFIX } from './utils/const';
import PetChart from './components/PetChart';
import { Wait } from './components/Wait';
import { BusRouteSearch } from './pages/BusRouteSearch';
import { BusRoute } from './pages/BusRoute';


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
        <Route path="/about" element={<BaseLayout><About /></BaseLayout>} />
        <Route path={`/${URI_PET_FIND_PREFIX}`} element={<BaseLayout><Wait /></BaseLayout>} />
        <Route path={`/search/:lang/:city`} element={<BaseLayout><BusRouteSearch /></BaseLayout>} />
        <Route path={`/:lang/:city/:route`} element={<BaseLayout><BusRoute /></BaseLayout>} />
        <Route path="/chart" element={<BaseLayout><PetChart /></BaseLayout>} />
        <Route path="/stores" element={<BaseLayout><Stores /></BaseLayout>} />
        <Route path={`/${URI_PET_FIND_PREFIX}/:id`} element={<BaseLayout><PetDetailsPage /></BaseLayout>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
