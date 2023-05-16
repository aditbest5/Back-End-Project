const db = require("../models");
const User = db.User;
const Post = db.Post;
const { uploader } = require("../lib/uploader");
const fs = require("fs");
const PostController = {
  getPost: async (req, res) => {
    try {
      const content = await Post.findAll({ raw: true });
      return res.status(200).json({
        content,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  postUser: async (req, res) => {
    try {
      const id = req.user.id;
      let path = `/post/${req.user.email}`;
      const upload = uploader(path, "IMG").fields([{ name: "file" }]); // parameter pertama pathnya dan parameter kedua prefixnya
      upload(req, res, async (err) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        }
        const { file } = req.files; // req.file ini yang membawa file dari front-end
        const filepath = file ? path + "/" + file[0].filename : null;
        let data = JSON.parse(req.body.data);
        console.log(data);
        const post = await Post.create({
          media: filepath,
          caption: data.caption,
          userId: req.user.id,
        });
        if (!post) {
          fs.unlinkSync("./public" + filepath);
          return res.status(500).json({
            message: "Gagal Post",
          });
        }
        return res.status(200).send({ message: "Upload file success" });
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      const deletePost = await Post.destroy({ where: { id } });
      if (!deletePost) {
        return res.status(500).json({ message: "Gagal Delete!" });
      }
      return res.status(200).json({ message: "Delete Success!" });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  editPost: async (req, res) => {
    try {
      const { id } = req.params;
      const { caption } = req.body;
      if (caption === "") {
        return res.status(409).json({ message: "Caption tidak boleh kosong!" });
      }
      let postUpdate = await Post.update({ caption }, { where: { id } });
      if (!postUpdate) {
        return res.status(409).json({ message: "Gagal Update!" });
      }
      return res.status(200).json({ message: "Update Caption Success!" });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
};

module.exports = PostController;
