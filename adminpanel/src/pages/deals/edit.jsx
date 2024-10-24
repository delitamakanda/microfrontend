import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import axiosInstance from "storefrontApp/api";
import { formatDate } from "../../helpers/utils";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

export const DealEdit = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const toast = useRef(null);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      image_url: "",
      start_date: "",
      end_date: "",
    },
  });

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/store/deals/${slug}/`).then((response) => {
      let defaultValues = {};
      defaultValues.title = response.data.title;
      defaultValues.slug = response.data.slug;
      defaultValues.description = response.data.description;
      defaultValues.image_url = response.data.image_url;
      defaultValues.start_date = formatDate(response.data.start_date);
      defaultValues.end_date = formatDate(response.data.end_date);
      reset(defaultValues);
      setLoading(false);
    });
  }, []);

  const handleSlugChange = (event) => {
    // format title to lower case and replace spaces with hyphens
    setNewSlug(event.target.value.toLowerCase().replace(/\s+/g, "-"));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    await axiosInstance.put(`/store/deals/${slug}/`, data);
    navigate(-1);
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
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
              text
              severity="secondary"
            />
            <span>Edit Deal</span>
          </div>
          <Button
            label="Refresh"
            icon="pi pi-refresh"
            outlined
            onClick={() => void 0}
          />
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-fluid">
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required." }}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Title</label>
                <InputText
                  id={field.name}
                  value={field.value}
                  className={classNames("mb-1 mt-1", {
                    "p-error": errors.title,
                    "p-invalid": fieldState.error,
                  })}
                  onChange={(e) =>
                    field.onChange(e.target.value) && handleSlugChange(e)
                  }
                  {...field}
                />
                {getFormErrorMessage("title")}
              </div>
            )}
          />
          <Controller
            name="slug"
            control={control}
            rules={{ required: "Slug is required.", min: 3, maxLength: 20 }}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Slug</label>
                <InputText
                  id={field.name}
                  value={field.value ?? newSlug}
                  className={classNames("mb-1 mt-1", {
                    "p-error": errors.slug,
                    "p-invalid": fieldState.error,
                  })}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
                {getFormErrorMessage("slug")}
              </div>
            )}
          />
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required." }}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Description</label>
                <InputTextarea
                  id={field.name}
                  value={field.value}
                  className={classNames("mb-1 mt-1", {
                    "p-error": errors.description,
                    "p-invalid": fieldState.error,
                  })}
                  onChange={(e) => field.onChange(e.target.value)}
                  {...field}
                />
                {getFormErrorMessage("description")}
              </div>
            )}
          />
          <Controller
            name="image_url"
            control={control}
            rules={{ required: "Image URL is required." }}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Image Url</label>
                <InputText
                  id={field.name}
                  value={field.value}
                  className={classNames("mb-1 mt-1", {
                    "p-error": errors.image_url,
                    "p-invalid": fieldState.error,
                  })}
                  {...field}
                />
                {getFormErrorMessage("image_url")}
              </div>
            )}
          />
          <Controller
            name="start_date"
            control={control}
            rules={{ required: "Start Date is required." }}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Start Date</label>
                <InputText
                  type="date"
                  id={field.name}
                  value={field.value}
                  className={classNames("mb-1 mt-1", {
                    "p-error": errors.start_date,
                    "p-invalid": fieldState.error,
                  })}
                  {...field}
                />
                {getFormErrorMessage("start_date")}
              </div>
            )}
          />
          <Controller
            name="end_date"
            control={control}
            rules={{ required: "End Date is required." }}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>End Date</label>
                <InputText
                  type="date"
                  id={field.name}
                  value={field.value}
                  className={classNames("mb-1 mt-1", {
                    "p-error": errors.end_date,
                    "p-invalid": fieldState.error,
                  })}
                  {...field}
                />
                {getFormErrorMessage("end_date")}
              </div>
            )}
          />
          <div className="flex justify-content-end">
            <Button
              label="Save"
              icon="pi pi-check"
              type="submit"
              className="p-button-success"
              disabled={loading}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => navigate(-1)}
              className="p-button-secondary"
            />
          </div>
        </div>
      </form>
      <Toast ref={toast} />
    </Card>
  );
};
