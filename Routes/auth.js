const { authControllers } = require("../Controllers");
const { verifyToken, checkRole } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const router = require("express").Router();
// const { auth } = require("../lib/authToken");

router.post(
  "/register",
  body("email").isEmail(),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(409).json({ message: "Email harus format email!" });
    }
    next(); // jika tervalidasi email maka akan next
  },
  authControllers.register
);
router.post("/login", authControllers.login);
router.get("/users", verifyToken, checkRole, authControllers.findAllUser);
router.patch("/verified", verifyToken, authControllers.verification);
router.patch(
  "/send-verification",
  verifyToken,
  authControllers.sendVerification
);

module.exports = router;
