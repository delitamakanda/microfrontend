import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useStaticPages } from "../../hooks/useStaticPages";
import { slugToTitle } from "../../helpers/formatters";
import { resolveFlatPage } from "../../helpers/flatpage";

const BUTTON =
  "inline-flex items-center justify-center min-h-[44px] px-5 rounded border-2 border-gray-900 dark:border-gray-100 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-100";

export const IframeComponent = (props) => {
  const { url, title } = props;

  return (
    <iframe
      title={title}
      src={url}
      className="block w-full h-[70vh] min-h-[60vh] rounded border border-gray-300 dark:border-gray-600 bg-white"
    />
  );
};

export const FlatPage = () => {
  const { state } = useLocation();
  const { slug } = useParams();
  const { pages, loading, error, retry } = useStaticPages();

  const page = resolveFlatPage({ state, pages, slug });
  const title = page?.title ?? slugToTitle(slug);

  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | Dearest.`;
    return () => {
      document.title = previous;
    };
  }, [title]);

  let content;
  if (page) {
    content = (
      <>
        <IframeComponent url={page.url} title={title} />
        <p className="mt-3">
          <a
            href={page.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BUTTON} w-full sm:w-auto`}
          >
            Open in a new tab
          </a>
        </p>
      </>
    );
  } else if (loading) {
    content = (
      <p role="status" className="py-8">
        Loading…
      </p>
    );
  } else if (error) {
    content = (
      <div role="alert" className="py-8">
        <p className="mb-4">We could not load this page. Please try again.</p>
        <button type="button" onClick={retry} className={BUTTON}>
          Retry
        </button>
      </div>
    );
  } else {
    content = (
      <div className="py-8">
        <p role="status" className="mb-4">
          Page not found.
        </p>
        <Link to="/" className={BUTTON}>
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      {content}
    </div>
  );
};
