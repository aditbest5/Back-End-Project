const db = require("../models");
const User = db.User;
const Post = db.Post;
const Comment = db.Comment;
const fs = require("fs");
const CommentController = {
  getComment: async (req, res) => {
    try {
      const comment = await Comment.findAll({ raw: true });
      if (!comment) {
        return res.status(409).send({
          message: "Gagal mendapatkan data",
        });
      }
      return res.status(200).send({
        comment,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  postComment: async (req, res) => {
    try {
      const id = req.user.id;
      const { idPost } = req.params;
      const { comment_text } = req.body;
      if (comment_text === "") {
        return res.status(500).send({ message: "Komentar tidak boleh kosong" });
      }
      const comment = await Comment.create({
        comment_text,
        userId: id,
        postId: idPost,
      });
      if (!comment) {
        return res.status(500).send({ message: "Gagal Comment" });
      }
      return res.status(200).send({ message: "Add new comment!" });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
};

module.exports = CommentController;
