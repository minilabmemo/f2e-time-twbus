
import './style/notosanstc.css';
import './style/style.css';
import { Header } from './components/header';
import PetFinder from './components/PetFinder';
import { Footer } from './components/Footer';
import { HashRouter, Route, Routes } from 'react-router-dom';

import styled from '@emotion/styled';
import { About } from './components/News';
import Stores from './components/Stores';
import PetDetailsPage from './components/PetDetailsPage';
import { URI_PET_FIND_PREFIX } from './components/const';
import PetChart from './components/PetChart';
import { Wait } from './components/Wait';



//TODO theme
const Base = styled.div`
  overflow: hidden; /* solve margin collapsing */
  background-color: #d0efff;
  width: 100%;
  height: auto;
`;

const Container = styled.div`
  background-color: #ffffff;

  box-sizing: border-box;
  height: auto;
 
  border-radius: 30px;
  font-family: 'Noto Sans TC Black';
  font-weight: 900;
  
  
`;
const PageContainer = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
 
`;



const PageContentBox = styled.div`

  background-color:#FEFEFE ;
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
  height: auto;
  display: flex;
 
  flex-direction: column;
  align-items: start;
  justify-content: start;
 
  position:relative
  
`;

const BaseLayout = ({ children }: { children: React.ReactNode }) => (
  <Base className="base">
    <Container className="container">
      <Header></Header>
      <PageContainer>
        <PageContentBox className='page-content-box'>
          {children}
        </PageContentBox>
      </PageContainer>

    </Container>
    <Footer></Footer>
  </Base>
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
