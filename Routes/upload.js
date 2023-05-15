const { uploaderController } = require("../Controllers");
const { verifyToken } = require("../middleware/auth");

const router = require("express").Router();
// const { auth } = require("../lib/authToken");

router.post("/upload", verifyToken, uploaderController.uploadFile);

module.exports = router;
