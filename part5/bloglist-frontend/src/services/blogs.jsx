import axios from "axios";
const baseUrl = "http://localhost:3001/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const cereate = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);

  return response.data;
};

const update = async (id, newObject) => {
  const response = axios.put(`${baseUrl}/${id}`, newObject);
  return response.data;
};

export default { getAll, cereate, setToken, update };
