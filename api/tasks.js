// POST /tasks: body validation, then authentication
router.post(
    "/",
    requireBody(["title", "done"]),
    getUserFromToken,
    requireUser,
    async (req, res) => {
        const { title, done } = req.body;
        const userId = req.user.id;
        const result = await db.query(
            "INSERT INTO tasks (title, done, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, done, userId]
        );
        const task = result.rows[0];
        res.status(201).json(task);
    }
);
import { Router } from "express";
import db from "../db/client.js";
import getUserFromToken from "../middleware/getUserFromToken.js";
import requireUser from "../middleware/requireUser.js";
import requireBody from "../middleware/requireBody.js";

const router = Router();


router.post(
    "/",
    requireBody(["title", "done"]),
    getUserFromToken,
    requireUser,
    async (req, res) => {
        const { title, done } = req.body;
        const userId = req.user.id;
        const result = await db.query(
            "INSERT INTO tasks (title, done, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, done, userId]
        );
        const task = result.rows[0];
        res.status(201).json(task);
    }
);


router.use(getUserFromToken);
router.use(requireUser);

router.get("/", async (req, res) => {
    const userId = req.user.id;
    const result = await db.query(
        "SELECT * FROM tasks WHERE user_id = $1",
        [userId]
    );
    const tasks = result.rows;
    res.status(200).json(tasks);
});

router.put("/:id", requireBody(["title", "done"]), async (req, res) => {
    const { title, done } = req.body;
    const taskId = req.params.id;
    const userId = req.user.id;

    const findResult = await db.query(
        "SELECT * FROM tasks WHERE id = $1",
        [taskId]
    );
    const task = findResult.rows[0];

    if (!task || task.user_id !== userId) {
        return res.status(403).send("Forbidden: You do not own this task.");
    }

    const updateResult = await db.query(
        "UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *",
        [title, done, taskId]
    );
    const updatedTask = updateResult.rows[0];
    res.status(200).json(updatedTask);
});

router.delete("/:id", async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    const findResult = await db.query(
        "SELECT * FROM tasks WHERE id = $1",
        [taskId]
    );
    const task = findResult.rows[0];

    if (!task || task.user_id !== userId) {
        return res.status(403).send("Forbidden: You do not own this task.");
    }

    await db.query(
        "DELETE FROM tasks WHERE id = $1",
        [taskId]
    );
    res.sendStatus(204);
});

export default router;
