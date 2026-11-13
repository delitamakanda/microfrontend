import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Tag } from "primereact/tag";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "storefrontApp/api";
import { formatPrice, getStatusSeverity } from "../../helpers/product";

export const ProductShow = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { id } = useParams();

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    setProduct(null);
    axiosInstance
      .get(`store/product/${id}/detail/`)
      .then((response) => {
        // An older remote resolves to undefined on HTTP errors.
        if (!response?.data) setError(true);
        else setProduct(response.data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const categories = product?.category_names ?? [];

  return (
    <Card
      className="shadow-1"
      title={
        <div className="flex justify-content-between align-items-center">
          <div className="flex align-items-center">
            <Button
              onClick={() => navigate(-1)}
              icon="pi pi-arrow-left"
              className="mr-1"
              aria-label="Go back"
              text
              severity="secondary"
            />
            <span>Product Details</span>
          </div>
          {product && (
            <Link to={`/products/edit/${id}`} className="no-underline">
              <Button label="Edit" icon="pi pi-pencil" outlined />
            </Link>
          )}
        </div>
      }
    >
      {isLoading && <p role="status">Loading...</p>}
      {error && (
        <div role="alert">
          <p className="text-red-700 mt-0">This product could not be loaded.</p>
          <Button label="Retry" icon="pi pi-refresh" outlined onClick={load} />
        </div>
      )}
      {product && (
        <>
          <h3 className="mt-0">{product.name}</h3>
          {product.image_url && <Image src={product.image_url} alt={product.name} width="160" />}
          <h4>Price</h4>
          <span>{formatPrice(product.price)}</span>
          <h4>Status</h4>
          <Tag value={product.status} severity={getStatusSeverity(product.status)} />
          <h4>Quantity</h4>
          <span>{product.stock_quantity}</span>
          <h4>Categories</h4>
          <span>{categories.length ? categories.join(", ") : "No category yet."}</span>
          <h4>Description</h4>
          <p className="mt-0">{product.description}</p>
        </>
      )}
    </Card>
  );
};
