import { Divider } from "primereact/divider";
import { SITE_TITLE, BLOG_URL, ROUTES } from "../../constants";
import { Link } from "react-router-dom";
import { useStaticPages } from "../../hooks/useStaticPages";

const linkClass =
  "mr-4 inline-block py-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

export const Footer = () => {
  const { pages } = useStaticPages();

  return (
    <>
      <Divider />
      <footer className="grid">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-y-1 list-none p-0 m-0">
            {pages.map((item) => (
              <li key={item.slug}>
                <Link
                  state={item}
                  className={linkClass}
                  to={`${ROUTES.FLATPAGE}/${item.slug}`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={BLOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} text-gray-900 dark:text-gray-100`}
              >
                Blog
              </a>
            </li>
          </ul>
        </nav>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} {SITE_TITLE}. All rights reserved.
        </p>
      </footer>
    </>
  );
};
