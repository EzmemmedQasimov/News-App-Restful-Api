const Post = require("../models/post");
const { validationResult } = require("express-validator/check");
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
  const title = req.body.title;
  const content = req.body.content;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed!",
      errors: errors.array(),
    });
  }
  const post = new Post({
    title: title,
    content: content,
    imageUrl:
      "https://learnenglish.britishcouncil.org/sites/podcasts/files/styles/430x261_4/public/2021-09/RS-1138994168_805_1.jpeg?itok=j2_zn9Ey",
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
