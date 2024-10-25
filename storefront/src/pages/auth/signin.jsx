import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { ROUTES } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

export const SigninPage = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token, login } = useAuth();

  const onSubmit = async ({ username, password }) => {
    try {
      await login(username, password);
      navigate(ROUTES.ORDER, { replace: true });
    } catch (error) {
      // Handle the specific error message here
      setError(
        `Failed to login. Please check your credentials. Error: ${error.message}`
      );
    }
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

  if (token) {
    return navigate(ROUTES.ORDER, { replace: true });
  }

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <>
      <h1>Signin Page</h1>
      {error && <div className="p-error">{error}</div>}
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
                type="password"
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
