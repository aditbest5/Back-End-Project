const db = require("../models");
const User = db.User;
const Token = db.Token;
const transporter = require("../lib/emailer");
const { createToken } = require("../lib/createToken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

const AuthController = {
  register: async (req, res) => {
    try {
      const { email, username, password, confirmPassword } = req.body;

      //check email
      const isEmailExist = await User.findOne({
        where: { email },
      });
      const isUsernameExist = await User.findOne({
        where: { username },
      });
      if (isEmailExist) {
        return res.status(409).json({
          message: "Email already exist!",
        });
      } else if (isUsernameExist) {
        return res.status(409).json({
          message: "Username already exist!",
        });
      }
      function validatePassword(password) {
        const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return regex.test(password);
      }
      // if(minimumPassword(password)){
      //   return res.status(409).json({
      //     message:
      //       "Password setidaknya terdiri dari huruf besar, simbol, dan angka",
      //   });
      // }
      if (!validatePassword(password)) {
        return res.status(409).json({
          message:
            "Password setidaknya terdiri dari huruf besar, simbol, angka, dan minimum 8 karakter",
        });
      }
      if (password !== confirmPassword) {
        return res.status(409).json({
          message: "Password harus sama",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      await User.create({
        username,
        email,
        password: hashPassword,
        isAdmin: false,
        status: "unverified",
      });
      let token = createToken({
        username,
        email,
        isAdmin: false,
        status: "unverified",
      }); // memasukan bahan data ke createToken untuk menjadi payloadnya
      const user = await User.findOne({
        where: { email },
      });
      await Token.create({
        token,
        userId: user.id,
      });
      await transporter.sendMail(
        {
          from: `Admin <aditbest5@gmail.com>`,
          to: `${email}`,
          subject: "Activate account",
          html: `<h1>Welcome to Purwadhika. Hello ${email}, please confirm your account <a href='http://localhost:3000/authentication/${token}'>here</a></h1>`,
        },
        (errMail, resMail) => {
          if (errMail) {
            console.log(errMail);
            res.status(500).send({
              message: "Verification Failed!",
              success: false,
              err: errMail,
            });
          }
          res.status(200).send({
            message: "Verification Success",
            success: true,
          });
        }
      );
      return res.status(200).json({
        token,
        message: "Register Success! Check Your Email",
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
      await User.update(
        { status: "verified" },
        { where: { email: req.user.email } }
      );
      await Token.destroy({ where: { userId: user.id } });
      return res
        .status(200)
        .send({ message: "Verified Account", success: true });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { emailUsername, password } = req.body;

      const checkEmail = await User.findOne({
        where: {
          [Op.or]: [{ email: emailUsername }, { username: emailUsername }],
        },
      });
      if (!checkEmail) {
        return res.status(409).json({
          message: "No Email or Username Found!",
        });
      }
      //   if (checkEmail.status === "unverified") {
      //     return res.status(409).json({
      //       message: `Your Account Unverified. Please Verified`,
      //     });
      //   }
      const checkPassword = await bcrypt.compare(password, checkEmail.password);
      if (!checkPassword) {
        return res.status(409).json({
          message: "Password is incorrect!",
        });
      }
      // Make JWT
      let payload = {
        id: checkEmail.id,
        email: checkEmail.email,
        username: checkEmail.username,
        status: checkEmail.status,
      };
      const token = createToken(payload);
      return res.status(200).json({
        token,
        message: "Login Success",
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  sendVerification: async (req, res) => {
    try {
      const user = User.findOne({ where: { email: req.user.email } });
      let token = createToken({
        username: req.user.username,
        email: req.user.email,
        isAdmin: false,
        status: "unverified",
      });
      await Token.update({ token: token }, { where: { userId: req.user.id } });
      await transporter.sendMail(
        {
          from: `Admin <aditbest5@gmail.com>`,
          to: `${req.user.email}`,
          subject: "Activate account",
          html: `<h1>Welcome to Purwadhika. Hello ${req.user.email}, please confirm your account <a href='http://localhost:3000/authentication/${token}'>here</a></h1>`,
        },
        (errMail, resMail) => {
          if (errMail) {
            console.log(errMail);
            res.status(500).send({
              message: "Verification Failed!",
              success: false,
              err: errMail,
            });
          }
          res.status(200).send({
            message: "Verification Success",
            success: true,
          });
        }
      );
      return res.status(200).json({
        token,
        message: "Verification Sent! Check Your Email",
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

module.exports = AuthController;
