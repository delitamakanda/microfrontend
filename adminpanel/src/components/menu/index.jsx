import { Link } from "react-router-dom";
import { TabMenu } from "primereact/tabmenu";
import { useAuth } from "storefrontApp/useAuth";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export const Menu = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const items = [
    {
      label: "Dashboards",
      icon: "pi pi-home",
      to: "/",
    },
    {
      label: "Products",
      icon: "pi pi-shopping-cart",
      to: "/products",
    },
    {
      label: "Categories",
      icon: "pi pi-tags",
      to: "/categories",
    },
    {
      label: "Deals",
      icon: "pi pi-calendar",
      to: "/deals",
    },
    {
      label: "Coupons",
      icon: "pi pi-tag",
      to: "/coupons",
    },
    {
      label: "Pages",
      icon: "pi pi-file",
      to: "/pages",
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
    },
  ].map((menuItem) => ({
    label: menuItem.label,
    icon: menuItem.icon,
    template: (item, options) => {
      if (item.label === "Logout") {
        return (
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            className="p-menuitem-link"
            text
            severity="secondary"
            onClick={disconnectAndSignOut}
          />
        );
      }
      return (
        <div onClick={options.onClick}>
          <Link to={menuItem.to} className={options.className}>
            <i className={menuItem.icon}></i>
            <span className="ml-2">{item.label}</span>
          </Link>
        </div>
      );
    },
  }));
  const disconnectAndSignOut = () => {
    logout();
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };
  return (
    <div className="sticky top-0 z-5">
      <TabMenu model={items} />
    </div>
  );
};
