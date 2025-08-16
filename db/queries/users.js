import db from "#db/client";

export async function createUser(username, password) {
  const result = await db.query(
    `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;`,
    [username, password]
  );
  return result.rows[0];
}
