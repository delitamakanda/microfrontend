import * as yup from "yup";

export const newsletterSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required.")
    .email("Enter a valid email address."),
});

// Returns an error message, or true when valid (react-hook-form `validate` contract).
export const validateNewsletterEmail = (email) => {
  try {
    newsletterSchema.validateSync({ email });
    return true;
  } catch (err) {
    return err.message;
  }
};
