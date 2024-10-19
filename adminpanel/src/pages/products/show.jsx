import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "storefrontApp/api";
import { Helmet } from "react-helmet-async";

export const ProductShow = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axiosInstance.get(`store/product/${id}/detail/`),
      axiosInstance.get(`store/category-list/`),
    ]).then(([product, category]) => {
      console.log(product.data);
      console.log(category.data);
      setProduct(product.data);
      const categoryNames = product.data.category.map(
        (uuid) => category.data.find((cat) => cat.uuid === uuid)?.name
      );
      console.log(categoryNames); // ["Electronics", "Clothing",...]
      setProduct(product.data);
      setCategory(categoryNames);
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
      <Helmet>
        <title>{`Dearest. | ${product?.name}`}</title>
      </Helmet>
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
