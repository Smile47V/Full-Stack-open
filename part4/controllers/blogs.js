const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require("../models/user")
const jwt = require('jsonwebtoken')


const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer', '')
  }
  return null
}


blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.
  find({}).populate('users')

  response.json(blogs)
})



blogsRouter.post('/', async (req, res) => {
  const body = req.body;

   

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id){
    return response.status(401).json({ err: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  
  user.blogs = user.blogs.concat(savedNote._id)
  await user.save()

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