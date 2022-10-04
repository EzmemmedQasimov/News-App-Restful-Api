const { validationResult } = require("express-validator/check");
exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: 1,
        title: "First Post",
        content: "First post content",
        imageUrl:
          "https://learnenglish.britishcouncil.org/sites/podcasts/files/styles/430x261_4/public/2021-09/RS-1138994168_805_1.jpeg?itok=j2_zn9Ey",
        creator: {
          name: "Gülnar",
        },
        createdAt: new Date(),
      },
      {
        _id: 2,
        title: "Second Post",
        content: "Second post content",
        imageUrl:
          "https://learnenglish.britishcouncil.org/sites/podcasts/files/styles/430x261_4/public/2021-09/GettyImages-1072206958_0.jpg?itok=qJTgFre7",
        creator: {
          name: "Əzməmməd",
        },
        createdAt: new Date(),
      },
    ],
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
  res.status(201).json({
    message: "Post created!",
    post: {
      id: new Date(),
      title: title,
      content: content,
      creator: { name: "Əzməmməd" },
      createdAt: new Date(),
    },
  });
};
