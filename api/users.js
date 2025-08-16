
import { Router } from "express";
import { createUser } from "../db/queries/users.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/jwt.js";
import requireBody from "../middleware/requireBody.js";
import db from "../db/client.js";

const router = Router();

router.post("/register", requireBody(["username", "password"]), async (req, res) => {
    console.log("Register route hit", req.body);
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await createUser(username, hashedPassword);
        const token = createToken({ id: user.id, username: user.username });
        res.status(201).send(token);
    } catch (err) {
        console.error(err);
     
        if (err.code === "23505") {
            return res.status(400).send("Username already taken.");
        }
        res.status(500).send("Server error.");
    }
});

router.post("/login", requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const result = await db.query(
        "SELECT * FROM users WHERE username = $1", [username]
    );
    const user = result.rows[0];
    if(!user) {
        return res.status(401).send("Invalid credentials.");
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).send("Invalid credentials");
    }
    const token = createToken({ id: user.id, username: user.username });
    res.status(200).send(token);
});

export default router;