import { Divider } from "primereact/divider";
import { SITE_TITLE, BLOG_URL, ROUTES, SOCIAL_LINKS } from "../../constants";
import { Link } from "react-router-dom";
import { useStaticPages } from "../../hooks/useStaticPages";
import { BRAND_TAGLINE, SHOP_LINKS } from "../../helpers/footerLinks";
import { NewsletterForm } from "./NewsletterForm";
import "primeicons/primeicons.css";

const linkClass =
  "inline-flex items-center min-h-[44px] rounded text-gray-700 dark:text-gray-300 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";
const headingClass =
  "m-0 mb-2 text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100";
const listClass = "list-none p-0 m-0";

export const Footer = () => {
  const { pages } = useStaticPages();

  return (
    <>
      <Divider />
      <footer className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <p className="m-0 text-xl font-bold text-gray-900 dark:text-gray-100">
              {SITE_TITLE}
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {BRAND_TAGLINE}
            </p>
          </div>
          <nav aria-labelledby="footer-shop">
            <h2 id="footer-shop" className={headingClass}>
              Shop
            </h2>
            <ul className={listClass}>
              {SHOP_LINKS.map((item) => (
                <li key={item.to}>
                  <Link className={linkClass} to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {pages.length > 0 && (
            <nav aria-labelledby="footer-help">
              <h2 id="footer-help" className={headingClass}>
                Help
              </h2>
              <ul className={listClass}>
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
              </ul>
            </nav>
          )}
          <nav aria-labelledby="footer-company">
            <h2 id="footer-company" className={headingClass}>
              Company
            </h2>
            <ul className={listClass}>
              <li>
                <a
                  href={BLOG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Blog
                </a>
              </li>
            </ul>
            <h2 className={`${headingClass} mt-4`}>Follow us</h2>
            <ul className={`${listClass} flex flex-wrap gap-1`}>
              {SOCIAL_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className={`${linkClass} justify-center min-w-[44px]`}
                  >
                    <i className={item.icon} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <section aria-labelledby="footer-newsletter">
            <h2 id="footer-newsletter" className={headingClass}>
              Newsletter
            </h2>
            <NewsletterForm />
          </section>
        </div>
        <p className="mt-8 text-gray-600 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} {SITE_TITLE} All rights reserved.
        </p>
      </footer>
    </>
  );
};
