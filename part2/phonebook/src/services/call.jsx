import axios from "axios";

const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
    return axios.get(baseUrl)
}

const create = (newOject) => {
    return axios.post(baseUrl, newOject)
}

const remove = (id) => {
    return axios.delete(`http://localhost:3001/api/persons/${id}`)
}
const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
}

export default{
    getAll: getAll,
    create: create,
    remove: remove,
    update: update
}