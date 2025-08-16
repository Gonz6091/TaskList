import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createTask } from "#db/queries/tasks";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user = await createUser("testy", "passwordyeah");

  await createTask("Task 1", false, user.id);
  await createTask("Task 2", true, user.id);
  await createTask("Task 3", true, user.id);
}
