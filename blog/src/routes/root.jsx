import { Outlet } from'react-router-dom'
import Footer from '../components/Footer';
import Header from '../components/Header';
import SectionContainer from '../components/SectionContainer';
import { useReadingProgress } from '../hooks/reading-progress';

const Root = () => {
  const completion = useReadingProgress();
 
  return (
    <div id="themeId" className="bg-white text-black antialiased dark:bg-gray-950 dark:text-white">
      <nav className='sticky z-50 top-0 backdrop-blur-3xl py-2'>
        <span id="progress-bar" style={{transform: `translateX(${completion - 100}%)`}} className='absolute bottom-0 w-full transition-transform duration-150 h-1 bg-pink-400'></span>
      </nav>
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
  )
};

export default Root;