import knex from "knex";
import dotenv from "dotenv";
import invariant from "tiny-invariant";

dotenv.config();

let dbPort = 0;
let dbPath = import.meta.env.DB_PATH;
let dbUser = import.meta.env.DB_USER;
let dbPass = import.meta.env.DB_PASS;
let dbName = import.meta.env.DB_NAME;
let dbPortString = import.meta.env.DB_PORT;

invariant(
  dbPath !== undefined ||
    dbUser !== undefined ||
    dbPass !== undefined ||
    dbPortString !== undefined ||
    dbName !== undefined,
  () => {
    throw new Response(
      `Error 93d6b961: Oops something bad happened. Please contact the administrator if you're seeing this error repeatedly.`,
      {
        status: 500,
      },
    );
  },
);

if (dbPortString !== undefined) {
  dbPort = parseInt(dbPortString);
}

export const knexDb = knex({
  client: "pg",
  connection: {
    host: dbPath,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPass,
  },
});
