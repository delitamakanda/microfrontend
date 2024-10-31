import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "storefrontApp/api";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { Editor } from "primereact/editor";

export const FlatPageUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [flatPage, setFlatPage] = useState(null);
  const contentEditorRef = useRef(null);

  const {
    control,
    handleSubmit,
    reset,
      watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      enable_comments: false,
      url: "",
      registration_required: false,
      template_name: "",
      sites: [],
    },
  });

  contentEditorRef.current = watch("content", "");

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/store/flatpage/${id}/`).then((response) => {
      let defaultValues = {};
      setFlatPage(response.data);
      defaultValues.title = response.data.title;
      defaultValues.content = response.data.content;
      defaultValues.enable_comments = response.data.enable_comments;
      defaultValues.url = response.data.url;
      defaultValues.registration_required = response.data.registration_required;
      defaultValues.template_name = response.data.template_name;
      defaultValues.sites = response.data.sites;
      reset(defaultValues);
      setLoading(false);
    });
  }, [id, reset]);

  const goBack = () => {
    navigate(-1);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    await axiosInstance.put(`/store/flatpage/${id}/`, data);
    toast.current.show({
      severity: "success",
      summary: `${flatPage?.title} Page Updated`,
      detail: "The flat page has been updated successfully.",
    });
    setTimeout(() => {
      setLoading(false);
    }, 3000);
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
              onClick={goBack}
              icon="pi pi-arrow-left"
              className="mr-1"
              text
              severity="secondary"
            />
            <span>Update {flatPage?.title} Page</span>
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
                    "p-invalid": fieldState.error,
                  })}
                  onChange={(e) => field.onChange(e.target.value)}
                />
                {getFormErrorMessage("title")}
              </div>
            )}
          />
          <Controller
            name="content"
            control={control}
            rules={{ required: "Content is required." }}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Content</label>
                  <Editor
                    id={field.name}
                    value={field.value}
                    ref={contentEditorRef}
                    onTextChange={(e) => field.onChange(e.htmlValue)}
                    className={classNames("mb-1 mt-1", {
                      "p-invalid": fieldState.error,
                    })}
                    style={{ 'width': '100%', height: '300px' }}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Enter content here..."
                  />
                {getFormErrorMessage("content")}
              </div>
            )}
          />
          <Controller
            name="enable_comments"
            control={control}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Enable Comments</label>
                <Checkbox
                  id={field.name}
                  checked={field.value}
                  className={classNames("mb-1 mt-1", {
                    "p-invalid": fieldState.error,
                  })}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                {getFormErrorMessage("enable_comments")}
              </div>
            )}
          />
          <Controller
            name="url"
            control={control}
            rules={{ required: "URL is required." }}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>URL</label>
                <InputText
                  id={field.name}
                  value={field.value}
                  className={classNames("mb-1 mt-1", {
                    "p-invalid": fieldState.error,
                  })}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Enter URL (optional)"
                />
                {getFormErrorMessage("url")}
              </div>
            )}
          />
          <Controller
            name="registration_required"
            control={control}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Registration Required</label>
                <Checkbox
                  id={field.name}
                  checked={field.value}
                  className={classNames("mb-1 mt-1", {
                    "p-invalid": fieldState.error,
                  })}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                {getFormErrorMessage("registration_required")}
              </div>
            )}
          />
          <Controller
            name="template_name"
            control={control}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Template Name</label>
                <InputText
                  id={field.name}
                  value={field.value}
                  className={classNames("mb-1 mt-1", {
                    "p-invalid": fieldState.error,
                  })}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Enter template name (optional)"
                />
                {getFormErrorMessage("template_name")}
              </div>
            )}
          />

          <div className="p-grid p-justify-content-end">
            <Button
              label="Save"
              type="submit"
              loading={loading}
              className="p-button-primary"
            />
          </div>
        </div>
      </form>
      <Toast ref={toast} />
    </Card>
  );
};
