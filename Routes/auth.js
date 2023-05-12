const { authControllers } = require("../Controllers");
const { verifyToken, checkRole } = require("../middleware/auth");

const router = require("express").Router();
// const { auth } = require("../lib/authToken");

router.post("/register", authControllers.register);
router.post("/login", authControllers.login);
router.get("/users", verifyToken, checkRole, authControllers.findAllUser);
router.patch("/verified", verifyToken, authControllers.verification);
router.patch(
  "/send-verification",
  verifyToken,
  authControllers.sendVerification
);

module.exports = router;
