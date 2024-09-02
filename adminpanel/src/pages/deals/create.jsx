import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import axiosInstance from "storefrontApp/api";
import { Helmet } from "react-helmet-async";

export const DealCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const goBack = () => {
    navigate(-1);
  };
  const toast = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      image_url: "",
    },
  });
  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const response = await axiosInstance.post(
      "store/deals/create/",
      JSON.stringify({
        title: data.title,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
        image_url: data.image_url,
      })
    );
    if (response.status === 201) {
      setLoading(false);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Deal created successfully",
      });
      navigate(`/deals`);
    } else {
      setLoading(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create deal",
      });
    }
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
          <span>Create Deal</span>
        </div>
      }
    >
      <Helmet>
        <title>Dearest. | Create deal</title>
      </Helmet>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-fluid">
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required." }}
            render={({ field }) => (
              <div
                className={classNames("p-field", { "p-invalid": errors.title })}
              >
                <label htmlFor="title">Title</label>
                <InputText
                  {...field}
                  placeholder="Enter title"
                  className="p-inputtext p-mb-3"
                />
                {getFormErrorMessage("title")}
              </div>
            )}
          />
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required." }}
            render={({ field }) => (
              <div
                className={classNames("p-field", {
                  "p-invalid": errors.description,
                })}
              >
                <label htmlFor="description">Description</label>
                <InputTextarea
                  {...field}
                  placeholder="Enter description"
                  rows={3}
                  cols={30}
                  className="p-inputtext p-mb-3"
                />
                {getFormErrorMessage("description")}
              </div>
            )}
          />
          <Controller
            name="start_date"
            control={control}
            rules={{ required: "Start date is required." }}
            render={({ field, fieldState }) => (
              <div
                className={classNames("p-field", {
                  "p-invalid": fieldState.invalid,
                })}
              >
                <label htmlFor="start_date">Start Date</label>
                <InputText
                  {...field}
                  type="date"
                  placeholder="Enter start date"
                  className="p-inputtext p-mb-3"
                />
                {getFormErrorMessage("start_date")}
              </div>
            )}
          />
          <Controller
            name="end_date"
            control={control}
            rules={{ required: "End date is required." }}
            render={({ field, fieldState }) => (
              <div
                className={classNames("p-field", {
                  "p-invalid": fieldState.invalid,
                })}
              >
                <label htmlFor="end_date">End Date</label>
                <InputText
                  {...field}
                  type="date"
                  placeholder="Enter end date"
                  className="p-inputtext p-mb-3"
                />
                {getFormErrorMessage("end_date")}
              </div>
            )}
          />
          <Controller
            name="image_url"
            control={control}
            rules={{ required: "Image URL is required." }}
            render={({ field }) => (
              <div
                className={classNames("p-field", {
                  "p-invalid": errors.image_url,
                })}
              >
                <label htmlFor="image_url">Image URL</label>
                <InputText
                  {...field}
                  placeholder="Enter image URL"
                  className="p-inputtext p-mb-3"
                />
                {getFormErrorMessage("image_url")}
              </div>
            )}
          />
          <div className="p-text-right">
            <Button
              type="submit"
              label="Save"
              className="p-button-success"
              disabled={loading}
            />
            <Toast ref={toast} />
          </div>
        </div>
      </form>
    </Card>
  );
};
