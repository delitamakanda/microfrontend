import axiosInstance from "storefrontApp/api";
import {
  buildFlatPagePayload,
  extractApiError,
  findUrlConflict,
  isSuccess,
} from "../../helpers/flatpage";

const URL_TAKEN = "This URL is already used by another page.";

/**
 * Creates (no id) or updates a flat page.
 * Resolves to null on success, `{ message, fields }` otherwise.
 * The shared Axios instance resolves to `undefined` on HTTP errors, hence the checks.
 */
export const saveFlatPage = async (values, { id, existing } = {}) => {
  const payload = buildFlatPagePayload(values, existing);

  // The API does not enforce unique URLs (and the shared Axios instance hides
  // error bodies), so check for a duplicate before saving.
  try {
    const check = await axiosInstance.get("store/flatpage/", {
      params: { q: payload.url, limit: 50 },
    });
    if (findUrlConflict(check?.data?.results, payload.url, id)) {
      return { message: URL_TAKEN, fields: { url: URL_TAKEN } };
    }
  } catch {
    // ignore: the save below reports any real failure
  }

  let response;
  try {
    response = id
      ? await axiosInstance.put(`store/flatpage/${id}/`, payload)
      : await axiosInstance.post("store/flatpage/", payload);
  } catch (error) {
    response = error?.response;
  }
  if (isSuccess(response)) return null;

  return extractApiError(response);
};
