import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "storefrontApp/useAuth";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { getLoginErrorMessage, getRedirectTarget } from "../../helpers/loginErrors";

import logo from "../../assets/logo.png";

const inputClassName =
  "block w-full rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, login } = useAuth();
  const location = useLocation();

  const {
    control,
    handleSubmit,
    resetField,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Signed in (now or before): go back to the page the user came from, or `/`.
  if (token) {
    return <Navigate to={getRedirectTarget(location)} replace />;
  }

  const onSubmit = async ({ username, password }) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      // The token is now set: the render above redirects immediately.
    } catch (err) {
      setError(getLoginErrorMessage(err));
      resetField("password", { defaultValue: "" });
      setLoading(false);
      setFocus("password");
    }
  };

  const renderField = ({ name, label, type, autoComplete }) => (
    <Controller
      name={name}
      control={control}
      rules={{ required: `${label} is required.` }}
      render={({ field }) => {
        const message = errors[name]?.message;
        const errorId = `${name}-error`;
        return (
          <div className="mb-3">
            <label className="block text-sm/6 font-medium text-gray-900" htmlFor={name}>
              {label}
            </label>
            <InputText
              id={name}
              ref={field.ref}
              name={field.name}
              value={field.value}
              type={type}
              autoComplete={autoComplete}
              aria-invalid={message ? "true" : "false"}
              aria-describedby={message ? errorId : undefined}
              className={classNames(inputClassName, { "p-invalid": message })}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
            />
            <small id={errorId} className="block p-error" style={{ minHeight: "1.25rem" }}>
              {message || " "}
            </small>
          </div>
        );
      }}
    />
  );

  return (
    <main>
      <div className="flex flex-col items-center justify-center px-3 py-8 mx-auto min-h-screen lg:py-0">
        <Link
          to="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 no-underline"
        >
          <img className="w-20 h-20 mr-2" src={logo} alt="" />
          Dearest.
        </Link>
        <div className="w-full bg-white rounded-lg shadow sm:max-w-md">
          <div className="p-4 space-y-4 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to the Admin Panel
            </h1>
            <div role="alert">
              {error && <p className="m-0 text-sm font-medium text-red-700">{error}</p>}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {renderField({ name: "username", label: "Username", type: "text", autoComplete: "username" })}
              {renderField({ name: "password", label: "Password", type: "password", autoComplete: "current-password" })}
              <Button
                type="submit"
                label="Sign In"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={loading}
                loading={loading}
              />
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};
