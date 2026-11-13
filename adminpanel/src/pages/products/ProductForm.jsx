import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { Image } from "primereact/image";
import { classNames } from "primereact/utils";
import {
  validateDescription,
  validateImageUrl,
  validatePrice,
  validateQuantity,
} from "../../helpers/product";

const EMPTY_VALUES = {
  name: "",
  description: "",
  price: 0,
  stock_quantity: 0,
  image_url: "",
  category: [],
};

/**
 * Shared create/edit form. `onSave(values)` resolves to `null` on success or
 * `{ message, fields }` on failure (fields: server-side errors by field name).
 */
// eslint-disable-next-line react/prop-types -- prop-types is not a dependency of this app
export const ProductForm = ({ initialValues = EMPTY_VALUES, categories = [], onSave }) => {
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const imageUrl = watch("image_url");
  const showPreview = validateImageUrl(imageUrl) === true && imageUrl?.trim();

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

  const invalid = (name) => !!errors[name];
  const describedBy = (name) => (errors[name] ? `${name}-error` : undefined);

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      {formError && (
        <p role="alert" className="text-red-700 mt-0">
          {formError}
        </p>
      )}
      <div className="grid">
        <div className="col-12 md:col-6 flex flex-column gap-3">
          <div className="flex flex-column gap-1">
            <label htmlFor="name">Name</label>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Name is required.",
                maxLength: { value: 255, message: "Name must be at most 255 characters." },
              }}
              render={({ field }) => (
                <InputText
                  id="name"
                  ref={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={classNames("w-full", { "p-invalid": invalid("name") })}
                  aria-invalid={invalid("name")}
                  aria-describedby={describedBy("name")}
                />
              )}
            />
            {errorMessage("name")}
          </div>
          <div className="flex flex-column gap-1">
            <label htmlFor="price">Price</label>
            <Controller
              name="price"
              control={control}
              rules={{ validate: validatePrice }}
              render={({ field }) => (
                <InputNumber
                  inputId="price"
                  inputRef={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(e) => field.onChange(e.value)}
                  useGrouping={false}
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  className="w-full"
                  inputClassName={classNames("w-full", { "p-invalid": invalid("price") })}
                  aria-invalid={invalid("price")}
                  aria-describedby={describedBy("price")}
                />
              )}
            />
            {errorMessage("price")}
          </div>
          <div className="flex flex-column gap-1">
            <label htmlFor="stock_quantity">Quantity</label>
            <Controller
              name="stock_quantity"
              control={control}
              rules={{ validate: validateQuantity }}
              render={({ field }) => (
                <InputNumber
                  inputId="stock_quantity"
                  inputRef={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(e) => field.onChange(e.value)}
                  useGrouping={false}
                  className="w-full"
                  inputClassName={classNames("w-full", { "p-invalid": invalid("stock_quantity") })}
                  aria-invalid={invalid("stock_quantity")}
                  aria-describedby={describedBy("stock_quantity")}
                />
              )}
            />
            {errorMessage("stock_quantity")}
          </div>
        </div>
        <div className="col-12 md:col-6 flex flex-column gap-3">
          <div className="flex flex-column gap-1">
            <label htmlFor="description">Description</label>
            <Controller
              name="description"
              control={control}
              rules={{ validate: validateDescription }}
              render={({ field }) => (
                <InputTextarea
                  id="description"
                  ref={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(e) => field.onChange(e.target.value)}
                  rows={4}
                  className={classNames("w-full", { "p-invalid": invalid("description") })}
                  aria-invalid={invalid("description")}
                  aria-describedby={describedBy("description")}
                />
              )}
            />
            {errorMessage("description")}
          </div>
          <div className="flex flex-column gap-1">
            <label htmlFor="category">Categories (optional)</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  inputId="category"
                  value={field.value}
                  options={categories}
                  optionLabel="name"
                  optionValue="uuid"
                  onChange={(e) => field.onChange(e.value)}
                  display="chip"
                  placeholder="Select categories"
                  className="w-full"
                  emptyMessage="No categories available"
                />
              )}
            />
            {errorMessage("category")}
          </div>
          <div className="flex flex-column gap-1">
            <label htmlFor="image_url">Image URL (optional)</label>
            <Controller
              name="image_url"
              control={control}
              rules={{ validate: validateImageUrl }}
              render={({ field }) => (
                <InputText
                  id="image_url"
                  ref={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={classNames("w-full", { "p-invalid": invalid("image_url") })}
                  aria-invalid={invalid("image_url")}
                  aria-describedby={describedBy("image_url")}
                />
              )}
            />
            {errorMessage("image_url")}
            {showPreview && <Image src={imageUrl.trim()} alt="Product preview" width="88" />}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <Button label="Save" type="submit" icon="pi pi-check" loading={saving} disabled={saving} />
      </div>
    </form>
  );
};
