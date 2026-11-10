import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "storefrontApp/api";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { FlatPageForm } from "./FlatPageForm";
import { saveFlatPage } from "./flatpageApi";

export const FlatPageUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [flatPage, setFlatPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axiosInstance.get(`store/flatpage/${id}/`);
      if (response?.data) setFlatPage(response.data);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const onSave = async (values) => {
    const failure = await saveFlatPage(values, { id, existing: flatPage });
    if (!failure) {
      navigate("/pages", {
        state: {
          toast: {
            severity: "success",
            summary: "Page updated",
            detail: `"${values.title.trim()}" has been updated.`,
          },
        },
      });
    }
    return failure;
  };

  return (
    <Card
      className="shadow-1"
      title={
        <div className="flex align-items-center">
          <Button
            type="button"
            onClick={() => navigate("/pages")}
            icon="pi pi-arrow-left"
            className="mr-1"
            text
            severity="secondary"
            aria-label="Back to pages"
          />
          <h3 className="m-0">Update {flatPage?.title} Page</h3>
        </div>
      }
    >
      {loading && (
        <div className="flex justify-content-center" role="status">
          <ProgressSpinner
            style={{ width: "40px", height: "40px" }}
            aria-label="Loading page"
          />
        </div>
      )}
      {!loading && error && (
        <div className="flex flex-column align-items-start gap-2" role="alert">
          <span className="p-error">
            Page not found or could not be loaded.
          </span>
          <Button type="button" label="Retry" icon="pi pi-refresh" outlined onClick={load} />
        </div>
      )}
      {!loading && !error && flatPage && (
        <FlatPageForm
          initialValues={{
            title: flatPage.title ?? "",
            url: flatPage.url ?? "",
            content: flatPage.content ?? "",
          }}
          onSave={onSave}
        />
      )}
    </Card>
  );
};
