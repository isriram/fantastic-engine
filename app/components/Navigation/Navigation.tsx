import { NavLink } from "@mantine/core";
import { useLocation } from "@remix-run/react";
import { verifyAccessAndToggle } from "~/services/access.client";
import React from "react";

export default function Navigation({ userSession }: { userSession: IUserSession | null }) {
	const location = useLocation();
	return (
		<React.Fragment>
			{userSession !== undefined && userSession !== null ? (
				<React.Fragment>
					{verifyAccessAndToggle(userSession, "read_scopes") && (
						<NavLink label={"Route 1"} component="a" href="/route-1" active={location.pathname.includes("/route-1")} />
					)}
				</React.Fragment>
			) : (
				<NavLink
					label={"Log in to see options"}
					component="a"
					href="/user/profile/login"
					active={location.pathname.includes("/user/profile/login")}
				/>
			)}
		</React.Fragment>
	);
}
