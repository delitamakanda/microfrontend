export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const USERNAME_MIN_LENGTH = 3;
export const EMAIL_MAX_LENGTH = 255;
export const PASSWORD_MIN_LENGTH = 8;

export const NETWORK_ERROR_MESSAGE = 'Could not reach the server. Please try again.';
export const GENERIC_ERROR_MESSAGE = 'Could not create your account. Please try again.';

export const FIELDS = ['username', 'email', 'password', 'passwordConfirm'];

// Maps the API field names onto the form field names.
const API_FIELD_TO_FORM_FIELD = {
    username: 'username',
    email: 'email',
    password1: 'password',
    password2: 'passwordConfirm',
};

// Each validator returns an error message, or true when valid
// (react-hook-form `validate` style).
export const validateUsername = (value) => {
    const v = (value ?? '').trim();
    if (!v) return 'Username is required.';
    if (v.length < USERNAME_MIN_LENGTH) {
        return `Username must be at least ${USERNAME_MIN_LENGTH} characters long.`;
    }
    return true;
};

export const validateEmail = (value) => {
    const v = (value ?? '').trim();
    if (!v) return 'Email is required.';
    if (v.length > EMAIL_MAX_LENGTH) return `Email cannot exceed ${EMAIL_MAX_LENGTH} characters.`;
    if (!EMAIL_PATTERN.test(v)) return 'Please enter a valid email address.';
    return true;
};

export const validatePassword = (value) => {
    if (!value) return 'Password is required.';
    if (value.length < PASSWORD_MIN_LENGTH) {
        return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;
    }
    return true;
};

export const validatePasswordConfirm = (value, password) => {
    if (!value) return 'Please confirm your password.';
    if (value !== password) return 'Passwords do not match.';
    return true;
};

const toMessage = (value) => (Array.isArray(value) ? value.join(' ') : String(value));

/**
 * Converts an Axios error from the registration endpoint into
 * `{ fieldErrors: { <formField>: message }, generalError: string | null }`.
 */
export const parseRegisterError = (error) => {
    const response = error?.response;
    if (!response) {
        return { fieldErrors: {}, generalError: NETWORK_ERROR_MESSAGE };
    }
    const data = response.data;
    const fieldErrors = {};
    const general = [];
    if (data && typeof data === 'object' && !Array.isArray(data)) {
        for (const [key, value] of Object.entries(data)) {
            if (value == null) continue;
            const formField = API_FIELD_TO_FORM_FIELD[key];
            if (formField) fieldErrors[formField] = toMessage(value);
            else general.push(toMessage(value));
        }
    }
    if (general.length === 0 && Object.keys(fieldErrors).length === 0) {
        general.push(GENERIC_ERROR_MESSAGE);
    }
    return { fieldErrors, generalError: general.length ? general.join(' ') : null };
};
