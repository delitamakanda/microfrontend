import { useCallback, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import axiosInstance from "storefrontApp/api";
import { ProductForm } from "./ProductForm";
import { saveProduct } from "./productApi";

export const ProductCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadCategories = useCallback(() => {
    setLoading(true);
    setError(false);
    axiosInstance
      .get("store/category-list/")
      .then((response) => {
        // An older remote resolves to undefined on HTTP errors.
        if (!response?.data) setError(true);
        else setCategories(response.data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const onSave = async (values) => {
    const result = await saveProduct(values);
    if (result.product) {
      navigate("/products", {
        state: { toast: { severity: "success", summary: "Success", detail: "Product created successfully" } },
      });
      return null;
    }
    if (result.createdId) {
      // Already created: continue on the edit page rather than risk a duplicate.
      navigate(`/products/edit/${result.createdId}`, {
        state: { toast: { severity: "warn", summary: "Categories not saved", detail: result.message } },
      });
      return null;
    }
    return result;
  };

  return (
    <Card
      className="shadow-1"
      title={
        <div className="flex align-items-center">
          <Button
            onClick={() => navigate(-1)}
            icon="pi pi-arrow-left"
            className="mr-1"
            aria-label="Go back"
            text
            severity="secondary"
          />
          <span>Create Product</span>
        </div>
      }
    >
      {isLoading && <p role="status">Loading...</p>}
      {error && (
        <div role="alert" className="mb-3">
          <p className="text-red-700 mt-0">Categories could not be loaded.</p>
          <Button label="Retry" icon="pi pi-refresh" outlined onClick={loadCategories} />
        </div>
      )}
      {!isLoading && !error && <ProductForm categories={categories} onSave={onSave} />}
    </Card>
  );
};
