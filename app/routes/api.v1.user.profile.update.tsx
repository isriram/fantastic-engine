import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { identityService } from "~/services/identity.server";
import { commitSession, getSession } from "~/services/session.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
	let flashMessage = {
		title: "",
		body: "",
		status: 200,
	};
	let result = 0;
	let formData = await request.formData();
	let session = await getSession(request.headers.get("cookie"));
	let userSession: IUserSession = await session.get(identityService.sessionKey);
	let userProfile: IUserProfileUpdate = {
		first_name: formData.get("first-name") as string,
		last_name: formData.get("last-name") as string,
		current_password: formData.get("current-password") as string,
		new_password: formData.get("new-password") as string,
		new_password_confirmation: formData.get("new-password-confirm") as string,
	};

	if (userProfile.new_password.length === 0) {
		// result = await updateUserProfile(userSession, userProfile);
		if (result === 200) {
			flashMessage = {
				title: "Success",
				body: "User name updated, please log out for changes to take effect.",
				status: 200,
			};
		}
	} else if (userProfile.new_password === userProfile.new_password_confirmation) {
		// result = await updateUserProfileAndPassword(userSession, userProfile);
		if (result === 200) {
			flashMessage = {
				title: "Success",
				body: "User profile and password updated, please log out for changes to take effect.",
				status: 200,
			};
		}
	} else {
		flashMessage = {
			title: "Error",
			body: "Passwords do not match",
			status: 403,
		};
	}

	if (result === 403) {
		flashMessage = {
			title: "Error",
			body: "Incorrect password",
			status: 404,
		};
	} else if (result === 404) {
		flashMessage = {
			title: "Error",
			body: "User not found",
			status: 404,
		};
	} else if (result === 500) {
		flashMessage = {
			title: "Internal Server Error",
			body: "Something went wrong, please try again. If problem persists, please contact the administrator",
			status: 200,
		};
	}

	session.flash("flash-message", JSON.stringify(flashMessage));

	return redirect(request.headers.get("referer") || "/", {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
};
