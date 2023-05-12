const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  let token = req.headers.authorization; // token yang sudah diambil melalui request headers authorizationnya
  if (!token) {
    // jika tidak mempunyai token maka unauthorized
    return res.status(401).json({ message: "Unauthorized Request" });
  }

  try {
    token = token.split(" ")[1]; // displit lalu diambil index ke 1 yakni tokennya doang
    if (token === null || !token) {
      // jika token null atau bukan token
      return res.status(401).json({ message: "Unauthorized Request" });
    }
    let verifyUser = jwt.verify(token, "private123"); // membuat verify dengan isinya token dan key saat login
    if (!verifyUser) {
      return res.status(401).json({ message: "Unauthorized Request" });
    }
    req.user = verifyUser;
    next();
  } catch (err) {
    res.status(500).json({ message: "invalid token" });
  }
};

// check role
const checkRole = async (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

module.exports = {
  verifyToken,
  checkRole,
};
