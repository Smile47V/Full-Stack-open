const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userExtractor = require("../utils/midleware").userExtractor;
const logger = require("../utils/logger");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");

  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    logger.info(request.token);
    return response.status(401).json({ err: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (req, res) => {
  const { id } = req.params;
  try {
    // Authenticatesw token
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }

    // Cheaks if blog actually exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ err: "blog not found" });
    }

    // Cheacks if the blog belongs to the login user

    if (blog.user.toString() !== decodedToken.id) {
      return res.status(403).json({ error: "Unuthorised action" });
    }

    await blog.remove();

    // Updates the the user array of blog id's
    const user = await User.findById(decodedToken.id);
    user.blogs = user.blog.filter((blogId) => blogId.toString() !== id);
    await user.save();

    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

blogsRouter.put("/:id", userExtractor, async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body; // Assuming we only update likes

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { likes }, // Only updating the likes field
    { new: true, runValidators: true }
  );

  if (updatedBlog) {
    res.json(updatedBlog);
  } else {
    res.status(404).end(); // Blog not found
  }
});

module.exports = blogsRouter;
