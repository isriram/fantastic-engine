import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { identityService } from "~/services/identity-access.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
	return await identityService.logout(request, {
		redirectTo: "/user/profile/login",
	});
}

export async function action({ params, request }: ActionFunctionArgs) {
	return await identityService.logout(request, {
		redirectTo: "/user/profile/login",
	});
}
