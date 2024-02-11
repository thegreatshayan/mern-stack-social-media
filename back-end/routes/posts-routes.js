const express = require("express");
const { check } = require("express-validator");

const postControllers = require("../controllers/posts-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:pid", postControllers.getPostById);

router.get("/user/:uid", postControllers.getPostByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [check("title").notEmpty(), check("description").isLength({ min: 5 })],
  postControllers.createPost
);

router.delete("/:pid", postControllers.deletePost);

module.exports = router;
