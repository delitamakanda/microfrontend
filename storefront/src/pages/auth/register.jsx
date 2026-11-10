import { Link, Navigate, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants";
import { useState } from "react";
import {
  FIELDS,
  parseRegisterError,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateUsername,
} from "./registerValidation";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { token, register } = useAuth();
  const [error, setError] = useState(null);

  const {
    handleSubmit,
    control,
    getValues,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  if (token) {
    return <Navigate to={ROUTES.ORDER} replace />;
  }

  const onSubmit = async (data) => {
    setError(null);
    try {
      await register(
        data.username.trim(),
        data.password,
        data.passwordConfirm,
        data.email.trim()
      );
      navigate(ROUTES.HOME, { replace: true });
    } catch (e) {
      const { fieldErrors, generalError } = parseRegisterError(e);
      FIELDS.forEach((name) => {
        if (fieldErrors[name]) {
          setFieldError(name, { type: "server", message: fieldErrors[name] });
        }
      });
      setError(generalError);
    }
  };

  const fields = [
    {
      name: "username",
      label: "Username",
      autoComplete: "username",
      rules: { validate: validateUsername },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      autoComplete: "email",
      rules: { validate: validateEmail },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      autoComplete: "new-password",
      help: "At least 8 characters",
      rules: { validate: validatePassword },
    },
    {
      name: "passwordConfirm",
      label: "Confirm password",
      type: "password",
      autoComplete: "new-password",
      rules: {
        validate: (value) => validatePasswordConfirm(value, getValues("password")),
      },
    },
  ];

  return (
    <>
      <h1>Create an account</h1>
      {error && (
        <div className="p-error mb-2" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {fields.map(({ name, label, type = "text", autoComplete, help, rules }) => (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => {
              const describedBy =
                [help && `${name}-help`, fieldState.error && `${name}-error`]
                  .filter(Boolean)
                  .join(" ") || undefined;
              return (
                <div className="mb-2">
                  <label htmlFor={name} className="block">
                    {label}
                  </label>
                  <InputText
                    id={name}
                    type={type}
                    autoComplete={autoComplete}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    aria-invalid={fieldState.error ? "true" : "false"}
                    aria-describedby={describedBy}
                    className={classNames("mb-1 mt-1 w-full", {
                      "p-invalid": fieldState.error,
                    })}
                  />
                  {help && (
                    <small id={`${name}-help`} className="block">
                      {help}
                    </small>
                  )}
                  <small id={`${name}-error`} className="p-error block" aria-live="polite">
                    {errors[name]?.message || <>&nbsp;</>}
                  </small>
                </div>
              );
            }}
          />
        ))}
        <div className="flex justify-content-end">
          <Button
            label="Register"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      </form>
      <p>
        Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
      </p>
    </>
  );
};
