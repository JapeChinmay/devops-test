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
  // Implement login later
});

export default router;
