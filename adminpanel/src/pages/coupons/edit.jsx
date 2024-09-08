import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "storefrontApp/api";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { Toast } from "primereact/toast";
import { Helmet } from "react-helmet-async";
import { formatDate } from "../../helpers/utils";

export const CouponEdit = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const {
    control,
    handleSubmit,
    reset,
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

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/store/coupon/${code}/`).then((response) => {
      let defaultValues = {};
      defaultValues.code = response.data.code;
      defaultValues.discount = response.data.discount;
      defaultValues.valid_from = formatDate(response.data.valid_from);
      defaultValues.valid_to = formatDate(response.data.valid_to);
      defaultValues.active = response.data.active;
      reset(defaultValues);
      setLoading(false);
    });
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    await axiosInstance.put(`/store/coupon/${code}/`, data);
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
            <span>Edit Coupon</span>
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
        <title>Dearest. | Edit Coupon</title>
      </Helmet>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-fluid">
          <Controller
            name="code"
            control={control}
            rules={{ required: "Code is required.", min: 3, maxLength: 20 }}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Code</label>
                <InputText
                  id={field.name}
                  value={field.value}
                  className={classNames("mb-1 mt-1", {
                    "p-invalid": fieldState.error,
                  })}
                  onChange={(e) => field.onChange(e.target.value)}
                />
                {getFormErrorMessage("code")}
              </div>
            )}
          />

          <Controller
            name="discount"
            control={control}
            rules={{ required: "Discount is required." }}
            render={({ field, fieldState }) => (
              <div className="mb-1">
                <label htmlFor={field.name}>Discount (%)</label>
                <InputNumber
                  id={field.name}
                  value={field.value}
                  className={classNames("mb-1 mt-1", {
                    "p-invalid": fieldState.error,
                  })}
                  onValueChange={(e) => field.onChange(e.target.value)}
                  min={0}
                  max={100}
                  decimalPlaces={2}
                  showButtons={true}
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
                  type="date"
                  id={field.name}
                  value={field.value}
                  className={classNames("mb-1 mt-1", {
                    "p-invalid": fieldState.error,
                  })}
                  onChange={(e) => field.onChange(e.target.value)}
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
                  type="date"
                  id={field.name}
                  value={field.value}
                  className={classNames("mb-1 mt-1", {
                    "p-invalid": fieldState.error,
                  })}
                  onChange={(e) => field.onChange(e.target.value)}
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
                  id={field.name}
                  className={classNames("mb-1 mt-1", {
                    "p-invalid": fieldState.error,
                  })}
                  onChange={(e) => field.onChange(e.target.value)}
                  checked={field.value}
                />
                {getFormErrorMessage("active")}
              </div>
            )}
          />

          <div className="flex justify-content-end">
            <Button
              label="Edit"
              type="submit"
              className="mr-1"
              disabled={loading}
            />
            <Button
              label="Cancel"
              onClick={() => navigate(-1)}
              className="mr-1"
              disabled={loading}
            />
          </div>
        </div>
      </form>
      <Toast ref={toast} />
    </Card>
  );
};
