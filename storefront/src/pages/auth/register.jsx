import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants";
import { useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { token, register } = useAuth();
  const [error, setError] = useState(null);

  if (token) {
    return navigate(ROUTES.ORDER, { replace: true });
  }

  const onSubmit = async (data) => {
    try {
      await register(
        data.username,
        data.password,
        data.passwordConfirm,
        data.email
      );
    } catch (error) {
      setError(`Failed to register. Error: ${error.message}`);
    }
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

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="text-sm text-red-500">{errors[name].message}</small>
    ) : (
      <small className="text-sm text-transparent">&nbsp;</small>
    );
  };

  return (
    <>
      <h1 className="text-2xl font-semibold">Register Page</h1>
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <Controller
          name="username"
          control={control}
          rules={{
            required: {
              message: "Username is required.",
              value: true,
              minLength: 3,
            },
          }}
          render={({ field, fieldState }) => (
            <div className="space-y-1">
              <label htmlFor={field.name} className="text-sm font-medium">
                Username
              </label>
              <Input
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className={cn(
                  fieldState.error && "border-red-500 focus-visible:ring-red-500"
                )}
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
              value: 255,
              message: "Email cannot exceed 50 characters.",
            },
          }}
          render={({ field, fieldState }) => (
            <div className="space-y-1">
              <label htmlFor={field.name} className="text-sm font-medium">
                Email
              </label>
              <Input
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className={cn(
                  fieldState.error && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {getFormErrorMessage(field.name)}
            </div>
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long.",
            },
          }}
          ref={passwordRef}
          render={({ field, fieldState }) => (
            <div className="space-y-1">
              <label htmlFor={field.name} className="text-sm font-medium">
                Password
              </label>
              <Input
                type="password"
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className={cn(
                  fieldState.error && "border-red-500 focus-visible:ring-red-500"
                )}
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
            required: "Confirm password is required.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long.",
            },
            validate: (value) =>
              value === passwordRef.current || "Passwords do not match.",
          }}
          render={({ field, fieldState }) => (
            <div className="space-y-1">
              <label htmlFor={field.name} className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className={cn(
                  fieldState.error && "border-red-500 focus-visible:ring-red-500"
                )}
                type="password"
              />
              {getFormErrorMessage(field.name)}
            </div>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Register</Button>
        </div>
      </form>
    </>
  );
};
