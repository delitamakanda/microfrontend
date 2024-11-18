import { useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { Loading } from "../../components/core";
import { useAuth } from "storefrontApp/useAuth";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, login, user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  if (token) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async ({ username, password }) => {
    try {
      setLoading(true);
      await login(username, password);
      setLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setError(
        `Failed to login. Please check your credentials. ${error.message}`
      );
      setLoading(false);
    }
  };

  const getFormErrorMessage = (name) => {
    return errors[name]?.message ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };
  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="w-20 h-20 mr-2" src={logo} alt="logo" />
          Dearest.
        </a>
        <div className="bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Please use the form to sign-in to Admin Panel
            </h1>
            {error && (
              <div className="text-sm text-red-500 dark:text-red-400">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="username"
                control={control}
                rules={{ required: "Username is required." }}
                render={({ field, fieldState }) => (
                  <div>
                    <label
                      className="block text-sm/6 font-medium text-gray-900"
                      htmlFor={field.name}
                    >
                      Username
                    </label>
                    <InputText
                      id={field.name}
                      value={field.value}
                      className={classNames("block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 ", {
                        "p-invalid": fieldState.error,
                      })}
                      onChange={(e) => field.onChange(e.target.value)}
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
                  <div>
                    <label
                      className="block text-sm/6 font-medium text-gray-900"
                      htmlFor={field.name}
                    >
                      Password
                    </label>
                    <InputText
                      id={field.name}
                      value={field.value}
                      type="password"
                      className={classNames("block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6", {
                        "p-invalid": fieldState.error,
                      })}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    {getFormErrorMessage(field.name)}
                  </div>
                )}
              />
              <Button
                type="submit"
                label="Sign In"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={loading}
                loading={loading}
              />
            </form>
            {loading && <Loading />}
            <Toast ref={toast} />
          </div>
        </div>
      </div>
    </section>
  );
};
