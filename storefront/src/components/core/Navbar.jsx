import { useAtomValue } from "jotai";
import { cartItemsQuantityAtom } from "../../store";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import ThemeSwitcher from "../ThemeSwitcher";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Button } from "../ui/button";
import {
  Home,
  LogIn,
  LogOut,
  Package,
  ShoppingCart,
  Tags,
  UserPlus,
} from "lucide-react";

export const Navbar = () => {
  const cartItemsQuantity = useAtomValue(cartItemsQuantityAtom);
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  const items = [
    {
      label: "Home",
      icon: Home,
      to: ROUTES.HOME,
    },
    {
      label: "Products",
      icon: Package,
      to: ROUTES.PRODUCTS,
    },
    {
      label: "Categories",
      icon: Tags,
      to: ROUTES.CATEGORIES,
    },
  ];
  const handleLogout = () => {
      logout();
      navigate(ROUTES.HOME, { replace: true });
  }
  return (
    <nav className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <h1 className="text-2xl font-semibold">Dearest.</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={ROUTES.CART}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>
              {cartItemsQuantity} item(s)
            </span>
          </Link>

          {!token && (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
              <Link
                to={ROUTES.SIGNUP}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Link>
            </>
          )}

          {token && (
            <>
              <Link
                to={ROUTES.ORDER}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Package className="h-4 w-4" />
                Orders
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((menuItem) => {
          const Icon = menuItem.icon;
          return (
            <NavLink
              key={menuItem.label}
              to={menuItem.to}
              className={({ isActive }) =>
                [
                  "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4" />
              {menuItem.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
