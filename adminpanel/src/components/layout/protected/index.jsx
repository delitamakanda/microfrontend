/* eslint-disable react/prop-types -- prop-types is not a dependency of this app */
import { useState } from "react";
import { Menu } from "../../menu";
import { Breadcrumb } from "../../breadcrumb";
import { useOutlet, Navigate } from "react-router-dom";
import { useAuth } from "storefrontApp/useAuth";
import { Button } from "primereact/button";
import { isStaffUser, signOut } from "../../../helpers/session";

// Shown to a signed-in account that is not staff (or whose profile does not
// say so): explains why the back office is unavailable and lets the user sign out.
const AccessDenied = ({ user, logout }) => {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    const ok = await signOut(logout, window.localStorage);
    if (!ok) {
      // The API logout failed: the stored session was cleared, reload to reset the auth state.
      window.location.assign("/login");
    }
  };

  return (
    <main
      className="flex align-items-center justify-content-center surface-ground p-3"
      style={{ minHeight: "100vh" }}
    >
      <section
        role="alert"
        aria-labelledby="access-denied-title"
        className="surface-card border-round shadow-2 p-4 text-center w-full"
        style={{ maxWidth: "28rem" }}
      >
        <i className="pi pi-lock text-4xl mb-3" style={{ color: "#374151" }} aria-hidden="true" />
        <h1 id="access-denied-title" className="text-2xl font-semibold m-0 mb-3" style={{ color: "#1f2937" }}>
          Access denied
        </h1>
        <p className="m-0 mb-4 line-height-3" style={{ color: "#374151" }}>
          {user?.username ? <>You are signed in as <strong>{user.username}</strong>, but this</> : "This"}{" "}
          account does not have staff access to the back office. Sign out and use a staff account.
        </p>
        <Button
          type="button"
          label="Sign out"
          icon="pi pi-sign-out"
          onClick={handleSignOut}
          loading={signingOut}
          disabled={signingOut}
        />
      </section>
    </main>
  );
};

export const Layout = () => {
  const { token, logout, user } = useAuth();
  const outlet = useOutlet();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!isStaffUser(user)) {
    return <AccessDenied user={user} logout={logout} />;
  }
  return (
    <div className="min-h-screen surface-ground">
      <Menu />
      <div className="p-3">
        <Breadcrumb />
        {outlet}
      </div>
    </div>
  );
};
