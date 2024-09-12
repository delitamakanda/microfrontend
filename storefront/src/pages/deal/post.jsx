import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../lib/api";
import { Card } from "primereact/card";
import { Image } from "primereact/image";

export const Post = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`store/deals/${slug}/`)
      .then((response) => {
        if (response.data) {
          setLoading(false);
          setPost(response.data);
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <Card>
      {error && <p>Error: {error.message}</p>}
      {isLoading && <p>Loading...</p>}
      {post && (
        <>
          <h2>{post?.title}</h2>
          <Image
            src={post?.image_url}
            width="100%"
            height="auto"
            alt={post?.title}
          />
          <p>{post?.description}</p>
        </>
      )}
    </Card>
  );
};
