const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
test('blog list are returned', async () => {
    await api
    .get('/api/blogs')
    .expect('content-type', /aplication\/json/)
})

after(async () => {
    await mongoose.connection.close()
})

test('a valid blog can be added', async () => {
    const initialBlogs = await Blog.find({});
  
    const newBlog = {
      title: 'New Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 0,
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    const blogsAfter = await Blog.find({});
    expect(blogsAfter).toHaveLength(initialBlogs.length + 1);
  
    const titles = blogsAfter.map((blog) => blog.title);
    expect(titles).toContain('New Blog');
});

test('blog without likes defaults to 0', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Author Test',
      url: 'http://testblognolikes.com',
    };
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    // Verify the likes property defaults to 0
    expect(response.body.likes).toBe(0);
});

test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Author Test',
      url: 'http://notitleblog.com',
      likes: 5,
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
  });
  
  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'Blog without URL',
      author: 'Author Test',
      likes: 5,
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
});
  