const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Post = require("../models/post");
const User = require("../models/user");

const getPostById = async (req, res, next) => {
  const postId = req.params.pid;

  try {
    const post = await Post.findById(postId);

    res.json({ post: post.toObject({ getters: true }) });
  } catch (err) {
    return next(new HttpError("Post Not Found!", 500));
  }
};

const getPostByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  try {
    const posts = await Post.find({ creator: userId });

    if (posts.length === 0) {
      return next(new HttpError("No Post Found", 500));
    }

    res.json({ posts: posts.map((post) => post.toObject({ getters: true })) });
  } catch (err) {
    return next(new HttpError("No Post Found", 500));
  }
};

const createPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError("Something wrong with values!", 422);

    return next(error);
  }

  const { title, description, creator } = req.body;

  const createdPost = new Post({ title, description, image: req.file.path, creator });

  try {
    const user = await User.findById(creator);

    if (!user) {
      const error = new HttpError("Could not Find User!", 422);

      return next(error);
    }

    await createdPost.save();

    user.posts.push(createdPost);

    await user.save();

    res.status(201).json({ post: createdPost });
  } catch (err) {
    const error = new HttpError("Creating Post Failed!", 500);

    return next(error);
  }
};

const deletePost = async (req, res, next) => {
  const postId = req.params.pid;

  try {
    const post = await Post.findById(postId).populate("creator");

    await post.deleteOne();

    post.creator.posts.pull(post);

    await post.creator.save();

    res.json({ message: "Post deleted." });
  } catch (err) {
    return next(new HttpError("Couldn't delete a post", 500));
  }
};

exports.getPostById = getPostById;
exports.getPostByUserId = getPostByUserId;
exports.createPost = createPost;
exports.deletePost = deletePost;
