import axios from 'axios'

const BASE_URL = 'http://backend-task-tracker.herokuapp.com/auth/'

// const BASE_URL = 'https://localhost:44359/v1'
const instance = axios.create({
    baseURL: BASE_URL,
    validateStatus: function (status) {
        return status >= 200 && status < 501
    },
})

export default {
  async authenticate (credentials, url) {
    return instance.post(url, {
        password: credentials.password,
        username: credentials.username,
      });
    },
}