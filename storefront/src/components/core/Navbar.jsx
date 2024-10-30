import "primeicons/primeicons.css";

import { useAtomValue } from "jotai";
import { cartItemsQuantityAtom } from "../../store";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { ROUTES } from "../../constants";
import ThemeSwitcher from "../ThemeSwitcher";
import { TabMenu } from "primereact/tabmenu";
import { useAuth } from "../../hooks/useAuth.jsx";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const cartItemsQuantity = useAtomValue(cartItemsQuantityAtom);
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      to: ROUTES.HOME,
    },
    {
      label: "Products",
      icon: "pi pi-shopping-cart",
      to: ROUTES.PRODUCTS,
    },
    {
      label: "Categories",
      icon: "pi pi-tags",
      to: ROUTES.CATEGORIES,
    },
  ].map((menuItem) => ({
    label: menuItem.label,
    icon: menuItem.icon,
    template: (item, options) => {
      return (
        <Button onClick={options.onClick}>
          <Link to={menuItem.to} className={options.className}>
            <i className={menuItem.icon}></i>
            <span className="ml-2">{item.label}</span>
          </Link>
        </Button>
      );
    },
  }));
  const handleLogout = () => {
      logout();
      navigate(ROUTES.HOME, { replace: true });
  }
  return (
    <>
      <ThemeSwitcher />
      <h1>Dearest.</h1>
      <Link to={ROUTES.CART}>
        <i className="pi pi-shopping-cart"></i> x {cartItemsQuantity} item(s)
      </Link>
        {!token && (<>
            <Link to={ROUTES.LOGIN}>
                <i className="pi pi-sign-in"></i> Sign In
            </Link>
            <Link to={ROUTES.SIGNUP}>
    <i className="pi pi-user-plus"></i> Register
    </Link>
        </>)}
        {token && (
            <>
      <Link to={ROUTES.ORDER}>
        <i className="pi pi-shopping-cart"></i> Orders
      </Link>

          <Button onClick={handleLogout}>
            <i className="pi pi-power-off"></i> Logout
          </Button></>
        )}
      <div className="my-5" />
      <TabMenu
        model={items}
        pt={{
          action: {
            className: "surface-ground",
          },
        }}
      />
    </>
  );
};
