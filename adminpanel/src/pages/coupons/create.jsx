import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import axiosInstance from "storefrontApp/api";
import { Helmet } from "react-helmet-async";

export const CouponCreate = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
      discount: 2,
      valid_to: "",
      valid_from: "",
      active: true,
    },
  });

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const response = await axiosInstance.post(
      `store/coupon/create/`,
      JSON.stringify({
        code: data.code,
        discount: data.discount,
        valid_to: data.valid_to,
        valid_from: data.valid_from,
        active: data.active,
      })
    );

    if (response.status === 201) {
      setLoading(false);
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
          <span>Create Coupon</span>
        </div>
      }
    >
      <Helmet>
        <title>Dearest. | Create coupon</title>
      </Helmet>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-fluid">
          <Controller
            name="code"
            control={control}
            rules={{
              required: "Code is required.",
              minLength: 3,
              maxLength: 20,
            }}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Code</label>
                <InputText
                  {...field}
                  placeholder="Enter coupon code"
                  className={classNames("p-inputtext p-component", {
                    "p-invalid": fieldState.invalid,
                  })}
                />
                {getFormErrorMessage("code")}
              </div>
            )}
          />
          <Controller
            name="discount"
            control={control}
            rules={{ required: "Discount is required.", min: 1, max: 100 }}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Discount (%)</label>
                <InputNumber
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  placeholder="Enter discount percentage"
                  className={classNames("p-inputtext p-component", {
                    "p-invalid": fieldState.invalid,
                  })}
                  max={100}
                  min={1}
                  inputMode="numeric"
                />
                {getFormErrorMessage("discount")}
              </div>
            )}
          />
          <Controller
            name="valid_from"
            control={control}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Valid From</label>
                <InputText
                  {...field}
                  placeholder="Enter valid from date"
                  onChange={(e) => field.onChange(e.target.value)}
                  className={classNames("p-inputtext p-component", {
                    "p-invalid": fieldState.invalid,
                  })}
                  type="date"
                />
                {getFormErrorMessage("valid_from")}
              </div>
            )}
          />
          <Controller
            name="valid_to"
            control={control}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Valid To</label>
                <InputText
                  {...field}
                  placeholder="Enter valid to date"
                  onChange={(e) => field.onChange(e.target.value)}
                  className={classNames("p-inputtext p-component", {
                    "p-invalid": fieldState.invalid,
                  })}
                  type="date"
                />
                {getFormErrorMessage("valid_to")}
              </div>
            )}
          />
          <Controller
            name="active"
            control={control}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Active</label>
                <InputSwitch
                  {...field}
                  checked={field.value}
                  className={classNames("p-inputswitch p-component", {
                    "p-invalid": fieldState.invalid,
                  })}
                />
                {getFormErrorMessage("active")}
              </div>
            )}
          />
          <div className="flex justify-content-end">
            <Button
              label="Save"
              icon="pi pi-check"
              className="ml-2"
              type="submit"
              loading={loading}
              disabled={loading}
              tooltip="Save coupon"
            />
          </div>
        </div>
      </form>
    </Card>
  );
};
