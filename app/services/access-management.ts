const verifyAccessAndToggle = (userSession: IUserSession, permission: string): boolean => {
	let scope = userSession.scope.split(",");
	if (scope.includes(permission) || scope.includes("admin")) {
		return true;
	} else {
		return false;
	}
};

export { verifyAccessAndToggle };
