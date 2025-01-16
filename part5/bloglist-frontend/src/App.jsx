import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Log from "./components/Log";
import blogService from "./services/blogs";
import loginService from "./services/login";
import CreateForm from "./components/Create_post";

const CereateForm = ({
  visible,
  setVisible,
  createBlog,
  title,
  handleName,
  author,
  handleAuthor,
  url,
  handleUrl,
}) => {
  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => setVisible(true)}>New note</button>
      </div>
      <div style={showWhenVisible}>
        <CreateForm
          createBlog={createBlog}
          title={title}
          handleName={handleName}
          author={author}
          handleAuthor={handleAuthor}
          url={url}
          handleUrl={handleUrl}
        />
        <button onClick={() => setVisible(false)}>Cancel</button>
      </div>
    </div>
  );
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setauthor] = useState("");
  const [url, setUrl] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs))
      .catch((err) => {
        console.error("Can't fetch blogs", err);
      });
  }, []);

  useEffect(() => {
    const logedinJSON = window.localStorage.getItem("logedinUser");
    if (logedinJSON) {
      const user = JSON.parse(logedinJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("logedinUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  //const likes = () = {}

  const createBlog = (event) => {
    event.preventDefault();

    const blogObject = {
      title: title,
      author: author,
      url: url,
    };

    blogService.cereate(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      setTitle("");
      setauthor("");
      setUrl("");
    });
  };

  const updateBlog = async (id, updatedBlogData) => {
    try {
      const updatedBlog = await blogService.update(id, updatedBlogData);
      setBlogs(
        blogs.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
      );
    } catch (error) {
      setErrorMessage("Error updating blog.");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleName = (event) => setTitle(event.target.value);
  const handleAuthor = (event) => setauthor(event.target.value);
  const handleUrl = (event) => setUrl(event.target.value);

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h1>Log into to application</h1>
      <div>
        username
        <input
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogList = () =>
    (blogs || []).map((blog, idx) => (
      <div key={idx}>
        <Blog blog={blog} updateBlog={updateBlog} />
      </div>
    ));

  const logOut = () => {
    window.localStorage.clear();
  };

  return (
    <div>
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <h2>blogs</h2>
          <div>{blogList()}</div>
          <Log name={user.name} exit={logOut} />
          <CereateForm
            visible={visible}
            setVisible={setVisible}
            createBlog={createBlog}
            title={title}
            handleName={handleName}
            author={author}
            handleAuthor={handleAuthor}
            url={url}
            handleUrl={handleUrl}
          />
        </div>
      )}
    </div>
  );
};

export default App;
