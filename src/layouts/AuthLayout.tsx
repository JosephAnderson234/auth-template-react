import { Outlet } from "react-router";

/** Layout centrado para pantallas de login / registro. */
export function AuthLayout() {
  return (
    <div className="center-page">
      <div className="card">
        <Outlet />
      </div>
    </div>
  );
}
