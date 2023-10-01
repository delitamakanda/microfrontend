import { Outlet } from'react-router-dom'
import Footer from '../components/Footer';
import Header from '../components/Header';
import SectionContainer from '../components/SectionContainer';

const Root = () => (
  <SectionContainer>
      <div className='flex h-screen flex-col justify-between font-sans'>
      <Header />
      <main className='mb-auto'>
        <Outlet />
      </main>
      <Footer />
      </div>
  </SectionContainer>
);

export default Root;