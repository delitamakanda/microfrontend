import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "storefrontApp/api";

export const ProductShow = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axiosInstance.get(`store/product/${id}/detail/`),
      axiosInstance.get(`store/category-list/`),
    ]).then(([product, category]) => {
      // An older remote resolves to undefined on HTTP errors.
      if (!product?.data || !category?.data) {
        setError(true);
        return;
      }
      setError(false);
      const categoryNames = product.data.category.map(
        (uuid) => category.data.find((cat) => cat.uuid === uuid)?.name
      );
      setProduct(product.data);
      setCategory(categoryNames);
    }).catch(() => {
      setError(true);
    }).finally(() => {
      setLoading(false);
    });
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Card
      className="shadow-1"
      title={
        <div className="flex align-items-center">
          <Button
            onClick={goBack}
            icon="pi pi-arrow-left"
            className="mr-1"
            text
            severity="secondary"
          />
          <span>Product Details</span>
        </div>
      }
    >
      {isLoading && <p>Loading...</p>}
      {error && <p role="alert" className="text-red-700">This product could not be loaded.</p>}
      <h3>{product?.name}</h3>
      <Image src={product?.image_url} alt={product?.name} width="100%" />
      <h3>Price</h3>
      <span>$ {product?.price}</span>
      <h3>Category</h3>
      {<span>{category ?? "no category yet..."}</span>}
      <h3>Description</h3>
      <span>{product?.description}</span>
    </Card>
  );
};
