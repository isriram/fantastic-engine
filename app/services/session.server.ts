import { createCookieSessionStorage } from "@remix-run/node";
import dotenv from "dotenv";

dotenv.config();

let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    secrets: [process.env.COOKIE_SESSION_SECRET!],
    isSigned: true,
    secure: true,
  },
});

let { getSession, commitSession, destroySession } = sessionStorage;

export { sessionStorage };
export { getSession, commitSession, destroySession };
