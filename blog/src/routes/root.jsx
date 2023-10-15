import { Outlet } from'react-router-dom'
import Footer from '../components/Footer';
import Header from '../components/Header';
import SectionContainer from '../components/SectionContainer';

const Root = () => (
  <div className="bg-white text-black antialiased dark:bg-gray-950 dark:text-white">
    <SectionContainer>
        <div className='h-screen flex-col justify-between font-sans'>
        <Header />
        <main className='mb-auto'>
          <Outlet />
        </main>
        <Footer />
        </div>
    </SectionContainer>
  </div>
);

export default Root;