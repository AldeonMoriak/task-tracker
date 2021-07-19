import axios from 'axios'

const BASE_URL = 'http://backend-task-tracker.herokuapp.com/tasks/'

// const BASE_URL = 'https://localhost:44359/v1'
const instance = axios.create({
  baseURL: BASE_URL,
  validateStatus: function (status) {
    return status >= 200 && status < 501
  },
  headers: {
    Authorization: `Bearer ${window.localStorage.getItem('access_token')}`
  }
})

export default {
  async createTask(payload) {
    return instance.post('createTask', {
      title: payload.title,
      parentId: payload.parentId,
    });
  },
  async getTodayTasks() {
    return instance.get('getTodayTasks');
  }
}