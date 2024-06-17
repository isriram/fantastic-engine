import { NavLink } from "@mantine/core";
import React from "react";
import { useLocation } from "@remix-run/react";

export default function User({ userSession }: { userSession: IUserSession | null }) {
  const location = useLocation();
  return (
    <React.Fragment>
      {userSession !== null ? (
        <NavLink label={userSession.first_name} defaultOpened>
          <NavLink
            label="Profile"
            active={location.pathname === "/user/profile/"}
            component="a"
            href="/user/profile/"
          />
          <NavLink
            label="Logout"
            active={location.pathname === "/api/v1/user/profile/logout"}
            component="a"
            href="/api/v1/user/profile/logout"
          />
        </NavLink>
      ) : (
        <NavLink
          label="Login"
          defaultOpened={location.pathname.includes("/user/")}
          component="a"
          href="/user/profile/login"
        />
      )}
    </React.Fragment>
  );
}
