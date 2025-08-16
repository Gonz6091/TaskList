import express from "express";
const app = express();

app.use(express.json());

export default app;

import usersRouter from "./api/users.js";
import tasksRouter from "./api/tasks.js";

app.use("/users", usersRouter)
app.use("/tasks", tasksRouter)

app.use((err, req, res, next) => {
  switch (err.code) {
    // Invalid type
    case "22P02":
      return res.status(400).send(err.message);
    // Unique constraint violation
    case "23505":
    // Foreign key violation
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
