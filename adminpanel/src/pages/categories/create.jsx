import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "storefrontApp/api";

export const CategoryCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = async (data) => {
    setLoading(true);

    const response = await axiosInstance.post(`store/category/`, data);

    if (response.status === 201) {
      setLoading(false);
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
        <div className="flex align-items-center">
          <Button
            onClick={goBack}
            icon="pi pi-arrow-left"
            className="mr-1"
            text
            severity="secondary"
          />
          <span>Create Category</span>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-fluid">
          {
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required.", min: 3, maxLength: 80 }}
              render={({ field, fieldState }) => (
                <div className="mb-1">
                  <label htmlFor={field.name}>Name</label>
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={classNames("mb-1 mt-1", {
                      "p-invalid": fieldState.error,
                    })}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {getFormErrorMessage(field.name)}
                </div>
              )}
            />
          }
        </div>
        <div className="flex justify-content-end">
          <Button label="Save" type="submit" loading={loading} />
        </div>
      </form>
    </Card>
  );
};
