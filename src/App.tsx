
import './style/notosanstc.css';
import './style/notosans.css';
import './style/style.css';
import { Header } from './components/layout/header';
import PetFinder from './components/CityBusHome';
import { Footer } from './components/Footer';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { About } from './components/News';
import Stores from './components/Stores';
import PetDetailsPage from './components/PetDetailsPage';
import { URI_PET_FIND_PREFIX } from './components/const';
import PetChart from './components/PetChart';
import { Wait } from './components/Wait';


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
        <Route path={`/${URI_PET_FIND_PREFIX}`} element={<BaseLayout><PetFinder /></BaseLayout>} />
        <Route path="/adopt" element={<BaseLayout><Wait /></BaseLayout>} />
        <Route path="/chart" element={<BaseLayout><PetChart /></BaseLayout>} />
        <Route path="/stores" element={<BaseLayout><Stores /></BaseLayout>} />
        <Route path={`/${URI_PET_FIND_PREFIX}/:id`} element={<BaseLayout><PetDetailsPage /></BaseLayout>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
