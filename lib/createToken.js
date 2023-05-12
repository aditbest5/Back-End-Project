const jwt = require("jsonwebtoken");

module.exports = {
  createToken: (payload) => {
    // payload merupakan data-data yang ingin dibawa oleh token
    return jwt.sign(payload, "private123", { expiresIn: "2h" }); // parameter pertama payload, kedua secret key, dan ketiga expire time
  },
};
