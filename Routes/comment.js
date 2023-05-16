const { commentControllers } = require("../Controllers");
const { verifyToken } = require("../middleware/auth");

const router = require("express").Router();
// const { auth } = require("../lib/authToken");

router.post("/post/:idPost", verifyToken, commentControllers.postComment);
router.get("/get-comment", verifyToken, commentControllers.getComment);

module.exports = router;
