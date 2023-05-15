const db = require("../models");
const User = db.User;
const Profile = db.Profile;
const Token = db.Token;
const transporter = require("../lib/emailer");
const { createToken } = require("../lib/createToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserController = {
  getUser: async (req, res) => {
    try {
      const user = await User.findOne({ where: { email: req.user.email } });
      let profile = await Profile.findOne({
        where: { userId: req.user.id },
      });
      if (profile === null) {
        await Profile.create({ userId: req.user.id });
      }
      profile = await Profile.findOne({
        where: { userId: req.user.id },
      });
      res.status(200).json({
        result: {
          id: user.id,
          email: user.email,
          username: user.username,
          status: user.status,
          fullname: profile.fullname,
          biodata: profile.biodata,
          profile_picture: profile.profile_picture,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  editUser: async (req, res) => {
    try {
      const id = req.user.id;
      const userName = req.user.username;
      const { username, fullname, biodata } = req.body;
      const isUsernameExist = await User.findOne({
        where: { username },
      });
      if (username === userName) {
        await User.update({ username }, { where: { id } });
        await Profile.update({ fullname, biodata }, { where: { userId: id } });
        return res.status(200).json({
          message: "Update Profile Success",
        });
      } else if (isUsernameExist) {
        return res.status(409).json({
          message: "Username Already Exist!",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  editPassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const password = await User.findAll({
        attributes: ["password"],
        where: { id: req.user.id },
      });
      if (currentPassword === "") {
        return res.status(409).json({
          message: "Fill Current Password!",
        });
      } else if (newPassword === "") {
        return res.status(409).json({
          message: "Fill New Password!",
        });
      }
      const checkPassword = await bcrypt.compare(
        currentPassword,
        password[0].password
      );
      if (!checkPassword) {
        return res.status(409).json({
          message: "Current Password is incorrect!",
        });
      }
      function validatePassword(password) {
        const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return regex.test(password);
      }
      if (!validatePassword(newPassword)) {
        return res.status(409).json({
          message:
            "Password setidaknya terdiri dari huruf besar, simbol, angka, dan minimum 8 karakter",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);
      await User.update(
        { password: hashPassword },
        { where: { id: req.user.id } }
      );
      return res.status(200).json({
        message: "Change Password Success!",
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  sendForgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      console.log(email);
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(409).json({ message: "No Email Found" });
      }
      let token = createToken({
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: false,
        status: "unverified",
      });
      const userToken = await Token.findOne({ where: { userId: user.id } });
      if (userToken !== null) {
        await Token.update({ token }, { where: { userId: user.id } });
      } else {
        await Token.create({
          token,
          userId: user.id,
        });
      }
      await transporter.sendMail(
        {
          from: `Admin <aditbest5@gmail.com>`,
          to: `${user.email}`,
          subject: "Reset Password",
          html: `<h1>Hello ${user.email}, please reset your account <a href='http://localhost:3000/reset-password/${token}'>here</a></h1>`,
        },
        (errMail, resMail) => {
          if (errMail) {
            console.log(errMail);
            res.status(500).json({
              message: "Reset Password Failed!",
              success: false,
              err: errMail,
            });
          }
          res.status(200).json({
            message: "Reset Password Success",
            success: true,
          });
        }
      );
      return res.status(200).json({
        token,
        message: "Reset Password Link Sent! Check Your Email",
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  verification: async (req, res) => {
    let token = req.headers.authorization; // token yang sudah diambil melalui request headers authorizationnya
    try {
      token = token.split(" ")[1]; // displit lalu diambil index ke 1 yakni tokennya doang
      const user = await User.findOne({ where: { email: req.user.email } });
      const userToken = await Token.findOne({ where: { userId: user.id } });
      if (userToken === null) {
        return res.status(409).send({ message: "Token Kadaluwarsa" });
      } else if (token !== userToken.token) {
        return res.status(409).send({ message: "Token Kadaluwarsa" });
      }
      return res.status(200).json({ message: "Get User Data", success: true });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { newPassword, confirmPassword } = req.body;
      if (newPassword === "") {
        return res.status(409).json({
          message: "Fill New Password!",
        });
      } else if (newPassword !== confirmPassword) {
        return res.status(409).json({
          message: "New Password and Confirm Password Must be Same!",
        });
      }
      function validatePassword(password) {
        const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return regex.test(password);
      }
      if (!validatePassword(newPassword)) {
        return res.status(409).json({
          message:
            "Password setidaknya terdiri dari huruf besar, simbol, angka, dan minimum 8 karakter",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);
      await User.update(
        { password: hashPassword },
        { where: { id: req.user.id } }
      );
      await Token.destroy({ where: { userId: req.user.id } });
      return res.status(200).json({
        message: "Reset Password Success!",
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  // find all users
  findAllUser: async (req, res) => {
    try {
      const users = await User.findAll({ raw: true });
      return res.status(200).json({
        result: users,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
};

module.exports = UserController;
