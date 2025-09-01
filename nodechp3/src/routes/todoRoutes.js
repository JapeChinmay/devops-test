import express, { Router } from "express";

import db from "../db.js";

const router = express.Router();

//all todos for user login
router.get("/", (req, res) => {});

//create a todo
router.post("/", (req, res) => {});

//update an todo

router.put("/:id", (req, res) => {});

//delete todo

router.delete("/:id", (req, res) => {});

export default router;
