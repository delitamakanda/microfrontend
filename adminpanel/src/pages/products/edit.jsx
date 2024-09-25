import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Image } from "primereact/image";
import { classNames } from "primereact/utils";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "storefrontApp/api";
import { Helmet } from "react-helmet-async";

export const ProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const toast = useRef(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      image_url: "",
      category: null,
    },
  });

  const mapCategoriesToOptions = (categories) => {
    return categories.map((category) => ({
      key: category.uuid,
      name: category.name,
    }));
  };

  useEffect(() => {
    Promise.all([
      axiosInstance.get(`store/category-list/`),
      axiosInstance.get(`store/product/${id}/detail/`),
    ]).then(([categoryList, productDetail]) => {
      setCategoryOptions(mapCategoriesToOptions(categoryList.data));
      let defaultValues = {};
      defaultValues.name = productDetail?.data?.name;
      defaultValues.description = productDetail?.data?.description;
      defaultValues.price = productDetail?.data?.price;
      defaultValues.stock_quantity = productDetail?.data?.stock_quantity;
      defaultValues.image_url = productDetail?.data?.image_url;
      const selectedKeys = productDetail?.data?.category;
      setSelectedCategories(
        selectedKeys.map((key) => ({
          key: key,
          name: categoryList.data.find((cat) => cat.uuid === key)?.name,
        }))
      );
      defaultValues.category = productDetail?.data?.category;
      reset(defaultValues);
    });
  }, []);

  const handleCategoryChange = (e) => {
    let cats = [...selectedCategories];

    if (e.checked) {
      cats.push(e.value);
    } else {
      cats = cats.filter((category) => category.key !== e.value.key);
    }
    setSelectedCategories(cats);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const response = await axiosInstance.put(
      `store/product/${id}/detail/`,
      JSON.stringify({
        name: data.name,
        description: data.description,
        price: data.price,
        stock_quantity: data.stock_quantity,
        image_url: data.image_url,
        category: selectedCategories.map((cat) => cat.key),
      })
    );

    if (response.status === 200) {
      setLoading(false);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Product updated successfully",
      });
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
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
            <span>Edit Product</span>
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
      <Helmet>
        <title>{`Dearest | Product no. ${id}`}</title>
      </Helmet>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="formgrid grid">
          <div className="field col">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required." }}
              render={({ field, fieldState }) => (
                <div className="mb-1">
                  <label htmlFor={field.name}>Name</label>
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={classNames(
                      "text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full ",
                      {
                        "p-invalid": fieldState.error,
                      }
                    )}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {getFormErrorMessage(field.name)}
                </div>
              )}
            />
            <Controller
              name="image_url"
              control={control}
              rules={{ required: "Image URL is required." }}
              render={({ field, fieldState }) => (
                <div className="mb-1">
                  <Image src={field.value} alt={field.value} width="88px" />
                  <label htmlFor={field.name}>Image Url</label>
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={classNames(
                      "text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full",
                      {
                        "p-invalid": fieldState.error,
                      }
                    )}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {getFormErrorMessage(field.name)}
                </div>
              )}
            />
            <Controller
              name="stock_quantity"
              control={control}
              rules={{
                required: "Quantity is required.",
              }}
              render={({ field, fieldState }) => (
                <div className="mb-1">
                  <label htmlFor={field.name}>Quantity</label>
                  <InputNumber
                    id={field.name}
                    inputRef={field.ref}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(e) => field.onChange(e.value ?? 0)}
                    inputClassName={classNames({
                      "p-invalid": fieldState.error,
                    })}
                    className="text-base text-color surface-overlay p-2 border-round appearance-none outline-none focus:border-primary w-full"
                  />
                  {getFormErrorMessage(field.name)}
                </div>
              )}
            />
          </div>
          <div className="field col">
            <Controller
              name="price"
              control={control}
              rules={{
                required: "Price is required.",
              }}
              render={({ field, fieldState }) => (
                <div className="mb-1">
                  <label htmlFor={field.name}>Price</label>
                  <InputNumber
                    id={field.name}
                    inputRef={field.ref}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(e) => field.onChange(e.value ?? 0)}
                    useGrouping={false}
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                    inputClassName={classNames({
                      "p-invalid": fieldState.error,
                    })}
                    className="text-base text-color surface-overlay p-2 border-round appearance-none outline-none focus:border-primary w-full"
                  />
                  {getFormErrorMessage(field.name)}
                </div>
              )}
            />
            <Controller
              name="category"
              control={control}
              rules={{ required: false }}
              render={({ field, fieldState }) => (
                <div className="mb-1">
                  <label htmlFor={field.name}>Category</label>
                  <div className="card flex flex-wrap justify-content-center gap-3">
                    {categoryOptions.map((category) => {
                      return (
                        <div
                          key={category.key}
                          className="flex align-items-center"
                        >
                          <Checkbox
                            inputId={category.key}
                            name="category"
                            value={category}
                            onChange={handleCategoryChange}
                            className={classNames({
                              "p-invalid": fieldState.error,
                            })}
                            checked={selectedCategories.some(
                              (item) => item.key === category.key
                            )}
                          />
                          <small className="p-error">&nbsp;</small>
                          <small className="p-error">
                            {errors.category?.message}
                          </small>
                          <label htmlFor={category.key} className="ml-2">
                            {category.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
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
                    {...field}
                    rows={4}
                    cols={30}
                    className={classNames(
                      "text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full",
                      {
                        "p-invalid": fieldState.error,
                      }
                    )}
                  />
                  {getFormErrorMessage(field.name)}
                </div>
              )}
            />
          </div>
        </div>
        <div className="formgrid grid">
          <Button label="Save" type="submit" loading={loading} />
        </div>
      </form>
      <Toast ref={toast} />
    </Card>
  );
};
