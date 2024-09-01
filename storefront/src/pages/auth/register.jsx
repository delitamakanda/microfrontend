import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/api";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const response = await axiosInstance.post(
      "auth/signup",
      JSON.stringify({
        username: data.username,
        password: data.password,
        email: data.email,
      })
    );
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  return (
    <>
      <h1>Register Page</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="username"
          control={control}
          rules={{ required: "Username is required." }}
          render={({ field, fieldState }) => (
            <div className="mb-1">
              <label htmlFor={field.name}>Username</label>
              <input
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className={classNames("mb-1 mt-1", {
                  "p-invalid": fieldState.error,
                })}
              />
              {getFormErrorMessage(field.name)}
            </div>
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required.",
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          }}
          render={({ field, fieldState }) => (
            <div className="mb-1">
              <label htmlFor={field.name}>Email</label>
              <input
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className={classNames("mb-1 mt-1", {
                  "p-invalid": fieldState.error,
                })}
              />
              {getFormErrorMessage(field.name)}
            </div>
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: "Password is required." }}
          render={({ field, fieldState }) => (
            <div className="mb-1">
              <label htmlFor={field.name}>Password</label>
              <input
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className={classNames("mb-1 mt-1", {
                  "p-invalid": fieldState.error,
                })}
                type="password"
              />
              {getFormErrorMessage(field.name)}
            </div>
          )}
        />
        <Controller
          name="passwordConfirm"
          control={control}
          rules={{
            required: "Confirm password is required.",
            validate: (value) => value === control.watch("password")?.value,
          }}
          render={({ field, fieldState }) => (
            <div className="mb-1">
              <label htmlFor={field.name}>Confirm Password</label>
              <input
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className={classNames("mb-1 mt-1", {
                  "p-invalid": fieldState.error,
                })}
                type="password"
              />
              {getFormErrorMessage(field.name)}
            </div>
          )}
        />
        <div className="flex justify-content-end">
          <Button label="Register" type="submit" />
        </div>
      </form>
    </>
  );
};
