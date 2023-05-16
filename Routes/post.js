const { postControllers } = require("../Controllers");
const { verifyToken } = require("../middleware/auth");

const router = require("express").Router();
// const { auth } = require("../lib/authToken");

router.post("/post", verifyToken, postControllers.postUser);
router.get("/get-post", verifyToken, postControllers.getPost);
router.delete("/delete-post/:id", verifyToken, postControllers.deletePost);
router.patch("/update-post/:id", verifyToken, postControllers.editPost);

module.exports = router;
