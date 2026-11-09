import { ROUTES } from "../../constants.js";

export const MAIN_LINKS = [
  { label: "Home", icon: "pi pi-home", to: ROUTES.HOME },
  { label: "Products", icon: "pi pi-shopping-cart", to: ROUTES.PRODUCTS },
  { label: "Categories", icon: "pi pi-tags", to: ROUTES.CATEGORIES },
];

export const GUEST_LINKS = [
  { label: "Sign In", icon: "pi pi-sign-in", to: ROUTES.LOGIN },
  { label: "Register", icon: "pi pi-user-plus", to: ROUTES.SIGNUP },
];

export const CUSTOMER_LINKS = [
  { label: "Orders", icon: "pi pi-receipt", to: ROUTES.ORDER },
];

export const CART_LINK = { to: ROUTES.CART, icon: "pi pi-shopping-cart" };

export const getAccountLinks = (token) =>
  token ? CUSTOMER_LINKS : GUEST_LINKS;

export const getCartLabel = (quantity) => {
  const count = Number.isFinite(quantity) && quantity > 0 ? quantity : 0;
  return `Cart, ${count} ${count === 1 ? "item" : "items"}`;
};

export const isLinkActive = (to, pathname) => {
  if (to === ROUTES.HOME) return pathname === ROUTES.HOME;
  return pathname === to || pathname.startsWith(`${to}/`);
};
