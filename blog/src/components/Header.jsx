import siteMetadata from "../data/siteMetadata";
import headerNavLinks from "../data/headerNavLinks";
import { Link } from'react-router-dom';
import ThemeSwitch from '../components/ThemeSwitch';
import MobileNav from '../components/MobileNav';

const Header = () => (
    <header className="flex items-center justify-between py-10">
        <div>
            <Link href="/" aria-label={siteMetadata.headerTitle}>
            <div className="flex items-center justify-between">
                {typeof siteMetadata.headerTitle === 'string' ? (
                <div className="hidden h-6 text-2xl font-semibold sm:block">
                    {siteMetadata.headerTitle}
                </div>
                ) : (
                siteMetadata.headerTitle
                )}
            </div>
            </Link>
        </div>
        <div className="flex items-center leading-5 space-x-4 sm:space-x-6">
        {headerNavLinks
          .filter((link) => link.href !== '/')
          .map((link) => (
            <Link
              key={link.text}
              to={link.href}
              className="hidden sm:block font-medium text-gray-900 dark:text-gray-100"
            >
              {link.text}
            </Link>
          ))}
      </div>
      <ThemeSwitch />
      <MobileNav />
    </header>
)

export default Header;
