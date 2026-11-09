import "primeicons/primeicons.css";

import { useAtomValue } from "jotai";
import { cartItemsQuantityAtom } from "../../store";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { ROUTES, SITE_TITLE } from "../../constants";
import ThemeSwitcher from "../ThemeSwitcher";
import { useAuth } from "../../hooks/useAuth.jsx";
import {
  CART_LINK,
  MAIN_LINKS,
  getAccountLinks,
  getCartLabel,
  isLinkActive,
} from "./navLinks";

const linkClass = (active) =>
  [
    "inline-flex items-center gap-2 min-h-[44px] px-3 rounded",
    "hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    active ? "font-bold underline" : "",
  ].join(" ");

const renderNavItem = (link, pathname) => {
  const active = isLinkActive(link.to, pathname);
  return (
    <Link
      key={link.to}
      to={link.to}
      className={linkClass(active)}
      aria-current={active ? "page" : undefined}
    >
      <i className={link.icon} aria-hidden="true"></i>
      <span>{link.label}</span>
    </Link>
  );
};

export const Navbar = () => {
  const cartItemsQuantity = useAtomValue(cartItemsQuantityAtom);
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME, { replace: true });
  };

  const cartLabel = getCartLabel(cartItemsQuantity);

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center min-h-[44px] text-2xl font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {SITE_TITLE}
      </Link>
      <nav aria-label="Main">
        <ul className="flex flex-wrap items-center gap-1 list-none m-0 p-0">
          {MAIN_LINKS.map((link) => (
            <li key={link.to}>{renderNavItem(link, pathname)}</li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-wrap items-center gap-1">
        <Link
          to={CART_LINK.to}
          className={linkClass(isLinkActive(CART_LINK.to, pathname))}
          aria-label={cartLabel}
          aria-current={isLinkActive(CART_LINK.to, pathname) ? "page" : undefined}
        >
          <i className={CART_LINK.icon} aria-hidden="true"></i>
          <span aria-hidden="true">{cartItemsQuantity || 0}</span>
        </Link>
        {getAccountLinks(token).map((link) => renderNavItem(link, pathname))}
        {token && (
          <Button
            type="button"
            onClick={handleLogout}
            className="min-h-[44px]"
            icon="pi pi-power-off"
            label="Logout"
          />
        )}
        <span className="inline-flex items-center justify-center min-h-[44px] min-w-[44px]">
          <ThemeSwitcher />
        </span>
      </div>
    </header>
  );
};
