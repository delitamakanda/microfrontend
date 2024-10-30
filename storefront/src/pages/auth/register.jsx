import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants";
import { useState, useRef } from "react";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { token, register } = useAuth();
  const [error, setError] = useState(null);

  if (token) {
      return navigate(ROUTES.ORDER, { replace: true });
  }


  const onSubmit = async (data) => {
   try {
       await register(data.username, data.password, data.passwordConfirm, data.email);
   } catch (error) {
       setError(`Failed to register. Error: ${error.message}`);
   }
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
      watch,
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });
    const passwordRef = useRef(null);
    passwordRef.current = watch("password", "");

  return (
    <>
      <h1>Register Page</h1>
        {error && <div className="p-error">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="username"
          control={control}
          rules={{
              required: {
                  message: "Username is required.",
                  value: true,
                  minLength: 3,
              }
          }}
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
          name="email"
          control={control}
          rules={{
            required: {
                message: "Email is required.",
                value: true,
            },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address.",
              },
              maxLength: {
                value: 255, message: "Email cannot exceed 50 characters.",
              }
          }}
          render={({ field, fieldState }) => (
            <div className="mb-1">
              <label htmlFor={field.name}>Email</label>
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
          rules={{ required: "Password is required.", minLength: {
              value: 8, message: "Password must be at least 8 characters long.",
              } }}
          ref={passwordRef}
          render={({ field, fieldState }) => (
            <div className="mb-1">
              <label htmlFor={field.name}>Password</label>
              <InputText
                type="password"
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
          name="passwordConfirm"
          control={control}
          ref={passwordRef}
          rules={{
            required: "Confirm password is required.", minLength: {
                value: 8,
                  message: "Password must be at least 8 characters long.",
              },
              validate: value => value === passwordRef.current || "Passwords do not match.",
          }}
          render={({ field, fieldState }) => (
            <div className="mb-1">
              <label htmlFor={field.name}>Confirm Password</label>
              <InputText
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
