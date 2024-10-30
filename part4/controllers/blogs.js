const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
    })
})



blogsRouter.post('/', async (req, res) => {
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

blogsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await Blog.findByIdAndRemove(id);
  res.status(204).end();  // 204 No Content when deletion is successful
});


blogsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;  // Assuming we only update likes

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { likes },  // Only updating the likes field
    { new: true, runValidators: true }
  );

  if (updatedBlog) {
    res.json(updatedBlog);
  } else {
    res.status(404).end();  // Blog not found
  }
});

module.exports = blogsRouter