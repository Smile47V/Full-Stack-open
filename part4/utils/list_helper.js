

const dummy = (blog) => {
    blog.forEach(element => {
        console.log(element)
    });
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0);
};


// blogUtils.js
const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
      return null; // Return null or undefined if the list is empty
    }
  
    return blogs.reduce((favorite, currentBlog) => {
      return currentBlog.likes > favorite.likes ? currentBlog : favorite;
    });
};
  

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}