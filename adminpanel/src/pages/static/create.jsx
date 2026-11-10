import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { FlatPageForm } from "./FlatPageForm";
import { saveFlatPage } from "./flatpageApi";

export const FlatPageCreate = () => {
  const navigate = useNavigate();

  const onSave = async (values) => {
    const error = await saveFlatPage(values);
    if (!error) {
      navigate("/pages", {
        state: {
          toast: {
            severity: "success",
            summary: "Page created",
            detail: `"${values.title.trim()}" has been created.`,
          },
        },
      });
    }
    return error;
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
          <h3 className="m-0">Create New Page</h3>
        </div>
      }
    >
      <FlatPageForm onSave={onSave} />
    </Card>
  );
};
