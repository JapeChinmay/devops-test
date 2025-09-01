import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all todos for logged-in user
router.get("/", (req, res) => {
  const { userId } = req;
  try {
    const getTodos = db.prepare(`SELECT * FROM todos WHERE users_id = ?`);
    const todos = getTodos.all(userId);
    return res.json({ todos });
  } catch (err) {
    console.error("Error fetching todos:", err.message);
    return res.status(500).json({ message: "Failed to fetch todos" });
  }
});

// CREATE a todo
router.post("/", (req, res) => {
  const { userId } = req;
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ message: "No task provided" });
  }

  try {
    const insertTodo = db.prepare(
      `INSERT INTO todos (users_id, task, completed) VALUES (?, ?, 0)`
    );
    const result = insertTodo.run(userId, task);
    return res
      .status(201)
      .json({ message: "Todo created", id: result.lastInsertRowid });
  } catch (err) {
    console.error("Error creating todo:", err.message);
    return res.status(500).json({ message: "Failed to create todo" });
  }
});

// UPDATE a todo
router.put("/:id", (req, res) => {
  const { userId } = req;
  const { id } = req.params;
  const { task, completed } = req.body;

  try {
    const updateTodo = db.prepare(
      `UPDATE todos SET task = ?, completed = ? WHERE id = ? AND users_id = ?`
    );
    const result = updateTodo.run(task, completed ? 1 : 0, id, userId);
    return res.json({ message: "Todo updated", changes: result.changes });
  } catch (err) {
    console.error("Error updating todo:", err.message);
    return res.status(500).json({ message: "Failed to update todo" });
  }
});

// DELETE a todo
router.delete("/:id", (req, res) => {
  const { userId } = req;
  const { id } = req.params;

  try {
    const deleteTodo = db.prepare(
      `DELETE FROM todos WHERE id = ? AND users_id = ?`
    );
    const result = deleteTodo.run(id, userId);
    return res.json({ message: "Todo deleted", changes: result.changes });
  } catch (err) {
    console.error("Error deleting todo:", err.message);
    return res.status(500).json({ message: "Failed to delete todo" });
  }
});

export default router;
