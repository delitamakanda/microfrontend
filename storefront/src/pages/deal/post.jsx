import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

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
      <CardHeader>
        <CardTitle>Deal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-sm text-red-500">Error: {error.message}</p>}
        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {post && (
          <>
            <h2 className="text-xl font-semibold">{post?.title}</h2>
            <img
              src={post?.image_url}
              width="100%"
              height="auto"
              alt={post?.title}
              className="w-full rounded-lg object-cover"
            />
            <p className="text-sm text-muted-foreground">{post?.description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
