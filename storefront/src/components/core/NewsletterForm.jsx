import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { validateNewsletterEmail } from "../../helpers/newsletter";

export const NewsletterForm = () => {
  const [confirmed, setConfirmed] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { email: "" } });

  // No newsletter endpoint exists yet in the API: validate client-side only.
  const onSubmit = () => {
    reset();
    setConfirmed(true);
  };

  const error = errors.email?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-2">
        <InputText
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={error ? "true" : "false"}
          aria-describedby={`newsletter-hint${error ? " newsletter-error" : ""}`}
          className="w-full min-h-[44px] px-3 rounded border border-gray-500 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          {...register("email", {
            validate: validateNewsletterEmail,
            onChange: () => setConfirmed(false),
          })}
        />
        {error && (
          <p
            id="newsletter-error"
            role="alert"
            className="m-0 text-sm text-red-700 dark:text-red-400"
          >
            {error}
          </p>
        )}
        <Button
          type="submit"
          label="Subscribe"
          className="w-full min-h-[44px] rounded bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        />
        {confirmed && (
          <p role="status" className="m-0 text-sm text-green-800 dark:text-green-400">
            Thanks for subscribing!
          </p>
        )}
        <p id="newsletter-hint" className="m-0 text-xs text-gray-600 dark:text-gray-400">
          By subscribing you agree to receive emails from Dearest.
        </p>
      </div>
    </form>
  );
};
