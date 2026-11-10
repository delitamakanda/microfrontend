import { Link } from 'react-router-dom';
import { NOT_FOUND_LINKS } from './notFoundLinks';

const BASE = 'inline-flex items-center justify-center min-h-[44px] px-5 rounded border-2 border-gray-900 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900';

export const NotFoundPage = () => (
    <div className="text-center my-5 px-4">
        <h1 className="text-3xl font-bold mb-3">Page not found</h1>
        <p className="mb-5">The page you are looking for does not exist or has moved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-xs sm:max-w-none mx-auto">
            {NOT_FOUND_LINKS.map((l) => (
                <Link
                    key={l.to}
                    to={l.to}
                    className={`${BASE} ${l.primary ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
                >
                    {l.label}
                </Link>
            ))}
        </div>
    </div>
);
