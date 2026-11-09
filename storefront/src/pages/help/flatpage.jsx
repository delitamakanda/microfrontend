import { useLocation, useParams } from "react-router-dom";
import { useStaticPages } from "../../hooks/useStaticPages";
import { slugToTitle } from "../../helpers/formatters";

export const IframeComponent = (props) => {
  const { url, title } = props;

  return (
    <>
      <iframe
        title={title}
        src={url}
        width="100%"
        height="100%"
        style={{ border: "0 none" }}
      />
    </>
  );
};

export const FlatPage = () => {
  const { state } = useLocation();
  const { slug } = useParams();
  const { pages, loading } = useStaticPages();

  const page = state?.url ? state : pages.find((p) => p.slug === slug);
  const title = page?.title ?? slugToTitle(slug);

  if (!page) {
    return (
      <>
        <h1>{title}</h1>
        <p role="status">{loading ? "Loading…" : "Page not found."}</p>
      </>
    );
  }

  return (
    <>
      <h1>{title}</h1>
      <IframeComponent url={page.url} title={title} />
    </>
  );
};
