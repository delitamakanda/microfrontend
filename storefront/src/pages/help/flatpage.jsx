import { useLocation } from "react-router-dom";

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
  const {
    state: { url, title },
  } = useLocation();

  return (
    <>
      <h1>{title}</h1>
      <IframeComponent url={url} title={title} />
    </>
  );
};
