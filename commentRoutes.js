const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const comment = new Comment({ ...req.body, author: req.user.id });
  await comment.save();
  res.status(201).json(comment);
});

router.get("/", async (req, res) => {
  const { post_id } = req.query;
  const comments = await Comment.find({ post: post_id }).populate("author", "username");
  res.json(comments);
});

router.get("/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  res.json(comment);
});

router.put("/:id", auth, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (comment.author.toString() !== req.user.id) return res.status(403).send("Forbidden");
  Object.assign(comment, req.body);
  await comment.save();
  res.json(comment);
});

router.delete("/:id", auth, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (comment.author.toString() !== req.user.id) return res.status(403).send("Forbidden");
  await comment.remove();
  res.send("Deleted");
});

module.exports = router;