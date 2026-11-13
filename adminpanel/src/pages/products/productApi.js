import axiosInstance from "storefrontApp/api";
import { extractApiError, isSuccess } from "../../helpers/flatpage";
import { buildProductPayload } from "../../helpers/product";

// The shared Axios instance may reject (error.response) or resolve to undefined on HTTP errors.
const call = async (request) => {
  try {
    return await request();
  } catch (error) {
    return error?.response;
  }
};

/**
 * Creates (no id) or updates a product.
 * Resolves to `{ product }` on success, `{ message, fields, createdId? }` otherwise.
 *
 * The API rejects a `category` key on `POST product/create/` (500), but `PUT` handles it:
 * categories are therefore saved with a second request after the creation.
 */
export const saveProduct = async (values, { id } = {}) => {
  const payload = buildProductPayload(values);

  if (id) {
    const response = await call(() => axiosInstance.put(`store/product/${id}/detail/`, payload));
    return isSuccess(response) ? { product: response.data } : extractApiError(response);
  }

  const { category, ...creation } = payload;
  const created = await call(() => axiosInstance.post("store/product/create/", creation));
  if (!isSuccess(created)) return extractApiError(created);
  if (!category.length) return { product: created.data };

  const uuid = created.data?.uuid;
  const updated = uuid
    ? await call(() => axiosInstance.put(`store/product/${uuid}/detail/`, payload))
    : undefined;
  if (isSuccess(updated)) return { product: updated.data };
  return {
    message: "The product was created, but its categories could not be saved.",
    fields: {},
    createdId: uuid,
  };
};
