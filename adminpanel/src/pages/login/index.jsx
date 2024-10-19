import { useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { Loading } from "../../components/core";
import { useAuth } from "../../hooks/auth/useAuth";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Helmet } from "react-helmet-async";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const { token, login } = useAuth();

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
    setLoading(true);

    const { data } = await login(username, password);
    if (data && data.user && !data.user.is_staff) {
      toast.current.show({
        severity: "info",
        summary: "Info",
        detail: "You are not admin",
      });
    } else if (data && data.user && data.user.is_staff) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "You are connected",
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Invalid username or password",
      });
    }
    setLoading(false);
  };

  const getFormErrorMessage = (name) => {
    return errors[name]?.message ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };
  return (
    <section className="bg-primary-reverse bg-primary-50 dark:bg-gray-900">
      <Helmet>
        <title>Dearest. | Login</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Dearest.
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Please use the form to sign-in to Admin Panel
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="username"
                control={control}
                rules={{ required: "Username is required." }}
                render={({ field, fieldState }) => (
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      htmlFor={field.name}
                    >
                      Username
                    </label>
                    <InputText
                      id={field.name}
                      value={field.value}
                      className={classNames(
                        "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                        {
                          "p-invalid": fieldState.error,
                        }
                      )}
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
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      htmlFor={field.name}
                    >
                      Password
                    </label>
                    <InputText
                      id={field.name}
                      value={field.value}
                      type="password"
                      className={classNames(
                        "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                        {
                          "p-invalid": fieldState.error,
                        }
                      )}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    {getFormErrorMessage(field.name)}
                  </div>
                )}
              />
              <Button
                type="submit"
                label="Sign In"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
