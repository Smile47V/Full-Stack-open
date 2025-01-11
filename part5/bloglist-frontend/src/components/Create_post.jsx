const CreateForm = ({
  createBlog,
  title,
  handleName,
  author,
  handleAuthor,
  url,
  handleUrl,
}) => {
  return (
    <form onSubmit={createBlog}>
      <h1>Create new</h1>
      <div>
        title:
        <input type="text" value={title} name="title" onChange={handleName} />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="author"
          onChange={handleAuthor}
        />
      </div>
      <div>
        url:
        <input type="text" value={url} name="url" onChange={handleUrl} />
      </div>
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateForm;
