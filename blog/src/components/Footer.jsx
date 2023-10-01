import siteMetadata from '../data/siteMetadata';
import { Link } from 'react-router-dom';

const Footer = () => (
    <footer>
        <div className="mt-16 flex flex-col items-center">
            <div className='mb-3 flex space-x-4'></div>
            <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div>{siteMetadata.author}</div>
                <div>{` • `}</div>
                <div>{`© ${new Date().getFullYear()}`}</div>
                <div>{` • `}</div>
                <Link href="/">{siteMetadata.title}</Link>
            </div>
            <div className='mb-8 text-sm text-gray-500 dark:text-gray-400'></div>
        </div>
    </footer>
);

export default Footer;