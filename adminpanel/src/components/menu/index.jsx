import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "storefrontApp/useAuth";
import { Button } from "primereact/button";
import { signOut } from "../../helpers/session";
import { NAV_ITEMS, isActiveRoute } from "../../helpers/navigation";

const LIST_ID = "main-nav-list";

export const Menu = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const disconnectAndSignOut = async () => {
    setSigningOut(true);
    const ok = await signOut(logout, window.localStorage);
    if (ok) {
      navigate("/login");
    } else {
      // The API logout failed: the stored session was cleared, reload to reset the auth state.
      window.location.assign("/login");
    }
  };

  return (
    <nav
      aria-label="Main"
      className="main-nav sticky top-0 z-5 surface-card shadow-1 flex flex-wrap align-items-center justify-content-between px-3 py-2 gap-2"
    >
      <Button
        type="button"
        label="Menu"
        icon="pi pi-bars"
        text
        className="md:hidden"
        aria-expanded={open}
        aria-controls={LIST_ID}
        onClick={() => setOpen((value) => !value)}
      />
      <ul
        id={LIST_ID}
        className={`main-nav__list list-none m-0 p-0 gap-1 order-3 md:order-none w-full md:w-auto ${
          open ? "flex flex-column" : "hidden"
        } md:flex md:flex-row`}
      >
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === "/"}
              aria-current={isActiveRoute(pathname, item.to) ? "page" : undefined}
              className={`main-nav__link ${isActiveRoute(pathname, item.to) ? "is-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <i className={item.icon} aria-hidden="true"></i>
              <span className="ml-2">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="flex align-items-center gap-2 ml-auto">
        {user?.username && (
          <span className="main-nav__user font-semibold">{user.username}</span>
        )}
        <Button
          type="button"
          label="Sign out"
          icon="pi pi-sign-out"
          outlined
          onClick={disconnectAndSignOut}
          loading={signingOut}
          disabled={signingOut}
        />
      </div>
    </nav>
  );
};
