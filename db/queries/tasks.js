import db from "#db/client";

export async function createTask(title, done, userId) {
  const result = await db.query(
    `INSERT INTO tasks (title, done, user_id) VALUES ($1, $2, $3) RETURNING *;`,
    [title, done, userId]
  );
  return result.rows[0];
}
