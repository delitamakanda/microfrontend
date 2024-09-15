import axiosInstance from "../../lib/api";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { ROUTES } from "../../constants";
import { useAuth } from "../../hooks/useAuth";

export const SigninPage = () => {
  const navigate = useNavigate();
  const { token, login } = useAuth();

  const onSubmit = async ({ username, password }) => {
    await login(username, password);
    navigate(ROUTES.ORDER, { replace: true });
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
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
      password: "",
    },
  });

  return (
    <>
      <h1>Signin Page</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="username"
          control={control}
          rules={{ required: "Username is required." }}
          render={({ field, fieldState }) => (
            <div className="mb-1">
              <label htmlFor={field.name}>Username</label>
              <InputText
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
              <InputText
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
        <div className="flex justify-content-end">
          <Button label="Signin" type="submit" />
        </div>
      </form>
    </>
  );
};
