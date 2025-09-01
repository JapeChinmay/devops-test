import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password || password.length < 8) {
    return res
      .status(400)
      .json({ message: "Invalid username or password (min 8 chars)" });
  }

  try {
    // Check if user already exists
    const userAlreadyExists = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(username);
    if (userAlreadyExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert new user
    const insertNewUser = db.prepare(
      `INSERT INTO users (username, password) VALUES (?, ?)`
    );
    const result = insertNewUser.run(username, hashedPassword);

    const userId = result.lastInsertRowid;

    // Insert each default todo
    const defaultTodo = "Hello welcome ";
    const insertTodo = db.prepare(
      `INSERT INTO todos (users_id, task, completed) VALUES (?, ?, ?)`
    );
    insertTodo.run(userId, defaultTodo, 0);

    // Generate JWT
    const token = jwt.sign(
      { id: result.lastInsertRowid, username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send response
    return res.status(201).json({ message: "Successful registration", token });
  } catch (err) {
    console.error("Error in /register:", err.message);
    return res.sendStatus(503);
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  try {
    const getUser = db
      .prepare(`SELECT * FROM users WHERE  username=?`)
      .get(username);
    if (!getUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordValid = bcrypt.compareSync(password, getUser.password);
    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: getUser.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (error) {}
});

export default router;
