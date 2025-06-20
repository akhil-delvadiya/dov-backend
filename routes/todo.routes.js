// routes/todo.routes.js
const express = require("express");
const Todo = require("../models/todo.model");
const router = express.Router();

// Get all todos
router.get("/todo/get", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add a new todo
router.post("/todo", async (req, res) => {
  const todo = new Todo({ title: req.body.title, name:req.body.name });
  const saved = await todo.save();
  res.json(saved);
});

// Toggle completed
router.patch("/todo/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.completed = !todo.completed;
  const updated = await todo.save();
  res.json(updated);
});

// Delete a todo
router.delete("/todo/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
