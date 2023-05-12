const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aditbest5@gmail.com",
    pass: "guqqtcpllddrliqb",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
