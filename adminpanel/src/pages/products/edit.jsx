import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "storefrontApp/api";
import { productToFormValues } from "../../helpers/product";
import { ProductForm } from "./ProductForm";
import { saveProduct } from "./productApi";

export const ProductEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const toast = useRef(null);
  const [categories, setCategories] = useState([]);
  const [initialValues, setInitialValues] = useState(null);
  const [version, setVersion] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      axiosInstance.get("store/category-list/"),
      axiosInstance.get(`store/product/${id}/detail/`),
    ])
      .then(([categoryList, productDetail]) => {
        // An older remote resolves to undefined on HTTP errors.
        if (!categoryList?.data || !productDetail?.data) {
          setError(true);
          return;
        }
        setCategories(categoryList.data);
        setInitialValues(productToFormValues(productDetail.data));
        setVersion((v) => v + 1);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (location.state?.toast) toast.current?.show(location.state.toast);
  }, [location.state]);

  const onSave = async (values) => {
    const result = await saveProduct(values, { id });
    if (result.product) {
      toast.current?.show({ severity: "success", summary: "Success", detail: "Product updated successfully" });
      return null;
    }
    toast.current?.show({ severity: "error", summary: "Error", detail: "The product could not be saved" });
    return result;
  };

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
            <span>Edit Product</span>
          </div>
          <Button label="Refresh" icon="pi pi-refresh" outlined onClick={load} disabled={isLoading} />
        </div>
      }
    >
      {isLoading && <p role="status">Loading...</p>}
      {error && (
        <div role="alert" className="mb-3">
          <p className="text-red-700 mt-0">This product could not be loaded.</p>
          <Button label="Retry" icon="pi pi-refresh" outlined onClick={load} />
        </div>
      )}
      {!isLoading && !error && initialValues && (
        <ProductForm key={version} initialValues={initialValues} categories={categories} onSave={onSave} />
      )}
      <Toast ref={toast} />
    </Card>
  );
};
