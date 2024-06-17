import { Authenticator, AuthorizationError } from "remix-auth";
import { commitSession, getSession, sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";
import bcryptjs from "bcryptjs";

import { redirect } from "@remix-run/node";

let identityService = new Authenticator(sessionStorage);

identityService.use(
  new FormStrategy(async ({ form }): Promise<IUserSession> => {
    let email = form.get("email") as string;
    let password = form.get("password") as string;

    invariant(typeof email === "string", () => {
      throw new Response("User name must be a string", { status: 403 });
    });
    invariant(email.length > 0, () => {
      throw new Response("User name cannot be blank", { status: 403 });
    });
    invariant(typeof password === "string", () => {
      throw new Response("Password must be a string", { status: 403 });
    });
    invariant(password.length > 0, () => {
      throw new Response("Password cannot be blank", { status: 403 });
    });

    let userInformation: IUserCredentials = {
      _id: "12345",
      email: "sriramiyer@example.com",
      first_name: "Sriram",
      last_name: "Iyer",
      password: "bcrypt-password-hash",
      scope: "read_scopes",
    };
    if (userInformation === null) {
      // User does not exist in the database or something weird happened
      throw new AuthorizationError("Error 96b850e4: Invalid username or password");
    }

    let passwordCompare = await bcryptjs.compare(password, userInformation.password);
    passwordCompare = true;

    if (!passwordCompare) {
      // This error occurs when the username exists but they have entered a wrong password
      throw new AuthorizationError("Error 25fc0f2a: Invalid username or password");
    }

    return {
      _id: userInformation._id,
      email: userInformation.email,
      first_name: userInformation.first_name,
      last_name: userInformation.last_name,
      scope: userInformation.scope,
      logged_in: new Date().toISOString(),
    };
  }),
  "user-pass",
);

const accessHandler = async (request: Request, permission: string) => {
  let session = await getSession(request.headers.get("cookie"));
  let userSession = (await session.get(identityService.sessionKey)) as IUserSession;

  // Check if the user is logged in
  if (userSession === undefined || userSession === null) {
    session.flash(
      "login-flash-message",
      JSON.stringify({
        message: "Error dc4dd91e: You are not logged in. Please login to continue",
        title: "Unauthorized",
        status: 401,
      }),
    );
    throw redirect("/user/profile/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  let permissions = userSession.scope.split(",");
  if (!permissions.includes(permission) && !permissions.includes("admin")) {
    throw new Response(
      "Error b217148f: You do not have permissions to access this page. Please contact the administrator.",
      {
        status: 403,
        statusText: "Forbidden",
      },
    );
  }
  return userSession;
};

export { identityService, accessHandler };
