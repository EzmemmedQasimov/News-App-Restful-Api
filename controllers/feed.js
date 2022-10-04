exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      { id: 1, title: "First Post", content: "First post content" },
      { id: 2, title: "Second Post", content: "Second post content" },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  res
    .status(201)
    .json({
      message: "Post created!",
      post: { id: new Date(), title: title, content: content },
    });
};
