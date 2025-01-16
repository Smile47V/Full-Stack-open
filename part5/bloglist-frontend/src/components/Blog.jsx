import { useState } from "react";
import blogService from "../services/blogs";
const Blog = ({ blog, updateBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const setVisible = () => {
    setShowDetails(!showDetails);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = () => {
    const updatedBlogData = {
      ...blog,
      likes: blog.likes + 1, // Increment the like count
    };
    updateBlog(blog._id, updatedBlogData); // Call updateBlog with the blog id and updated data
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}-{blog.author}
        <button onClick={setVisible}>{showDetails ? "Hide" : "show"}</button>
      </div>
      <div>
        {showDetails && (
          <div>
            <p>{blog.url}</p>
            <p>
              {blog.likes}
              <button onClick={handleLike}>Like</button>
            </p>

            <p>{blog.user.username}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Blog;
