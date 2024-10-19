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


test('a blog can be deleted', async () => {
    // First, create a new blog to delete
    const newBlog = {
      title: 'Blog to be deleted',
      author: 'Delete Author',
      url: 'http://tobedeleted.com',
      likes: 2,
    };
  
    const blogResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    const blogToDelete = blogResponse.body;
  
    // Perform the delete operation
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);
  
    // Verify that the blog is no longer in the database
    const blogsAfter = await Blog.find({});
    expect(blogsAfter).toHaveLength(0);  // Assuming only one blog was in the DB
  
    const titles = blogsAfter.map(b => b.title);
    expect(titles).not.toContain(blogToDelete.title);
  });



  test('a blog\'s likes can be updated', async () => {
    // First, create a new blog to update
    const newBlog = {
      title: 'Blog to be updated',
      author: 'Update Author',
      url: 'http://tobeupdated.com',
      likes: 5,
    };
  
    const blogResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    const blogToUpdate = blogResponse.body;
  
    // Update the likes field
    const updatedLikes = { likes: 10 };
  
    const updatedResponse = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  
    // Verify that the likes were updated
    expect(updatedResponse.body.likes).toBe(10);
  });
  