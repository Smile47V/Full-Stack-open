const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/api/blogs', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
    })
})



blogsRouter.post('/api/blogs', async (req, res) => {
  const body = req.body;

  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title or url missing' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
})


module.exports = blogsRouter