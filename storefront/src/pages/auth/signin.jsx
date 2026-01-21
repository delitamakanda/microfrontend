import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";

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
      <small className="text-sm text-red-500">{errors[name]?.message}</small>
    ) : (
      <small className="text-sm text-transparent">&nbsp;</small>
    );
  };

  return (
    <>
      <h1 className="text-2xl font-semibold">Signin Page</h1>
      {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <Controller
          name="username"
          control={control}
          rules={{ required: "Username is required." }}
          render={({ field, fieldState }) => (
            <div className="space-y-1">
              <label htmlFor={field.name} className="text-sm font-medium">
                Username
              </label>
              <Input
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className={cn(fieldState.error && "border-red-500 focus-visible:ring-red-500")}
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
            <div className="space-y-1">
              <label htmlFor={field.name} className="text-sm font-medium">
                Password
              </label>
              <Input
                id={field.name}
                type="password"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className={cn(fieldState.error && "border-red-500 focus-visible:ring-red-500")}
              />
              {getFormErrorMessage(field.name)}
            </div>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Signin</Button>
        </div>
      </form>
    </>
  );
};
