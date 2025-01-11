import { useState } from "react";

const Blog = ({ blog }) => {
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
            <p>{blog.likes}</p>
            <p>{blog.user.username}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Blog;
