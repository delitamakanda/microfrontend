import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import { classNames } from "primereact/utils";
import {
  isContentEmpty,
  urlToSlug,
  validateFlatPageUrl,
} from "../../helpers/flatpage";

const EMPTY_VALUES = { title: "", url: "", content: "" };

/**
 * Shared create/edit form. `onSave(values)` resolves to `null` on success or
 * `{ message, fields }` on failure (fields: server-side errors by field name).
 */
// eslint-disable-next-line react/prop-types -- prop-types is not a dependency of this app
export const FlatPageForm = ({ initialValues = EMPTY_VALUES, onSave }) => {
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const slug = urlToSlug(watch("url"));

  const submit = async (values) => {
    setSaving(true);
    setFormError("");
    try {
      const error = await onSave(values);
      if (error) {
        setFormError(error.message);
        Object.entries(error.fields || {}).forEach(([name, message]) =>
          setError(name, { type: "server", message })
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const errorMessage = (name) =>
    errors[name] ? (
      <small id={`${name}-error`} className="p-error block" role="alert">
        {errors[name].message}
      </small>
    ) : null;

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <div className="flex flex-column gap-3">
        {formError && (
          <div className="p-error" role="alert">
            <i className="pi pi-exclamation-triangle mr-2" aria-hidden="true" />
            {formError}
          </div>
        )}
        <Controller
          name="title"
          control={control}
          rules={{
            validate: (v) => v.trim() !== "" || "Title is required.",
          }}
          render={({ field, fieldState }) => (
            <div className="flex flex-column gap-1">
              <label htmlFor="flatpage-title">Title</label>
              <InputText
                id="flatpage-title"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                className={classNames({ "p-invalid": fieldState.error })}
                aria-invalid={!!fieldState.error}
                aria-describedby={fieldState.error ? "title-error" : undefined}
              />
              {errorMessage("title")}
            </div>
          )}
        />
        <Controller
          name="url"
          control={control}
          rules={{ validate: validateFlatPageUrl }}
          render={({ field, fieldState }) => (
            <div className="flex flex-column gap-1">
              <label htmlFor="flatpage-url">URL</label>
              <InputText
                id="flatpage-url"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                placeholder="/help/shipping/"
                className={classNames({ "p-invalid": fieldState.error })}
                aria-invalid={!!fieldState.error}
                aria-describedby={
                  fieldState.error ? "url-error url-help" : "url-help"
                }
              />
              <small id="url-help" className="text-color-secondary">
                Must start and end with &quot;/&quot;.{" "}
                {slug
                  ? `Shown in the storefront Help menu as /pages/${slug}`
                  : "Shown in the storefront Help menu as /pages/help-shipping"}
              </small>
              {errorMessage("url")}
            </div>
          )}
        />
        <Controller
          name="content"
          control={control}
          rules={{
            validate: (v) => !isContentEmpty(v) || "Content is required.",
          }}
          render={({ field, fieldState }) => (
            <div className="flex flex-column gap-1">
              <label id="flatpage-content-label" htmlFor="flatpage-content">
                Content
              </label>
              <Editor
                id="flatpage-content"
                value={field.value}
                onTextChange={(e) => field.onChange(e.htmlValue ?? "")}
                className={classNames({ "p-invalid": fieldState.error })}
                style={{ height: "300px" }}
                placeholder="Enter content here..."
                aria-labelledby="flatpage-content-label"
              />
              {errorMessage("content")}
            </div>
          )}
        />
        <div>
          <Button
            type="submit"
            label="Save"
            icon="pi pi-check"
            loading={saving}
            disabled={saving}
          />
        </div>
      </div>
    </form>
  );
};
