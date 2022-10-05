const Post = require("../models/post");
const { validationResult } = require("express-validator/check");
const fs = require("fs");
const path = require("path");
exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: "Success",
        posts: posts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed!",
      errors: errors.array(),
    });
  }
  if (!req.file) {
    return res.status(422).json({
      message: "File doesnt exsist!",
    });
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: "Əzməmməd" },
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post created!",
        post: { result },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          message: "Product not found",
          errors: errors.array(),
        });
      }
      res.status(200).json({
        message: "Success!",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    return res.status(422).json({
      message: "File doesnt exsist",
    });
  }
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          message: "Post not found!",
        });
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Success",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        res.status(404).json({
          message: "Post not found!",
        });
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      res.status(200).json({ message: "Post deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
