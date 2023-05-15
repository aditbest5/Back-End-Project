const { userControllers } = require("../Controllers");
const { verifyToken } = require("../middleware/auth");

const router = require("express").Router();
// const { auth } = require("../lib/authToken");

router.get("/get-user", verifyToken, userControllers.getUser);
router.get("/reset-token", verifyToken, userControllers.verification);
router.patch("/reset-password", verifyToken, userControllers.resetPassword);
router.patch("/edit-user", verifyToken, userControllers.editUser);
router.patch("/edit-password", verifyToken, userControllers.editPassword);
router.post("/send-forgot-password", userControllers.sendForgotPassword);

module.exports = router;
