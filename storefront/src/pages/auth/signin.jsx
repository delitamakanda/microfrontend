import { Controller, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { ROUTES } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { getLoginErrorMessage, getRedirectTarget } from "./loginHelpers";

const FIELDS = [
  {
    name: "username",
    label: "Username or email",
    autoComplete: "username",
    rules: {
      validate: (value) => value.trim() !== "" || "Username is required.",
    },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "current-password",
    rules: { required: "Password is required." },
  },
];

export const SigninPage = () => {
  const [error, setError] = useState(null);
  const errorRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const {
    handleSubmit,
    control,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const onSubmit = async ({ username, password }) => {
    setError(null);
    try {
      await login(username.trim(), password);
      navigate(getRedirectTarget(location.state, ROUTES.ORDER), { replace: true });
    } catch (e) {
      resetField("password");
      setError(getLoginErrorMessage(e));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="mb-4">Sign in</h1>
      {error && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="p-error mb-3 font-semibold"
        >
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {FIELDS.map(({ name, label, type = "text", autoComplete, rules }) => (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
              <div className="mb-3">
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
                  aria-describedby={fieldState.error ? `${name}-error` : undefined}
                  className={classNames("mt-1 w-full min-h-[44px]", {
                    "p-invalid": fieldState.error,
                  })}
                />
                <small id={`${name}-error`} className="p-error block" aria-live="polite">
                  {errors[name]?.message || <>&nbsp;</>}
                </small>
              </div>
            )}
          />
        ))}
        <Button
          label="Sign in"
          type="submit"
          className="w-full min-h-[44px]"
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </form>
      <p className="mt-4">
        <Link to={ROUTES.FORGOT_PASSWORD}>Forgot your password?</Link>
      </p>
      <p className="mt-2">
        New here? <Link to={ROUTES.SIGNUP}>Create an account</Link>
      </p>
    </div>
  );
};
