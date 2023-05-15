const db = require("../models");
const Profile = db.Profile;
const jwt = require("jsonwebtoken");
const { uploader } = require("../lib/uploader");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const UploaderController = {
  uploadFile: async (req, res) => {
    try {
      let path = `/${req.user.email}`;
      const upload = uploader(path, "IMG").fields([{ name: "file" }]); // parameter pertama pathnya dan parameter kedua prefixnya
      upload(req, res, async (err) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        }
        const { file } = req.files; // req.file ini yang membawa file dari front-end
        const filepath = file ? path + "/" + file[0].filename : null;
        let image = await Profile.update(
          { profile_picture: filepath },
          { where: { userId: req.user.id } }
        );
        if (!image) {
          fs.unlinkSync("./public" + filepath);
          res.status(500).json({ message: "Gagal upload" });
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
};

module.exports = UploaderController;
