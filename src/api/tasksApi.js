import axios from 'axios'

const BASE_URL = 'http://backend-task-tracker.herokuapp.com/tasks/'

// const BASE_URL = 'https://localhost:44359/v1'
const instance = axios.create({
  baseURL: BASE_URL,
  validateStatus: function (status) {
    return status >= 200 && status < 501
  },
});

instance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('access_token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${ token }`;
      config.headers['Content-Type'] = 'application/json; charset=utf-8';
      config.headers['Accept'] = '*/*';
    }

    return config;
  }, 

  (error) => {
    return Promise.reject(error);
  }
);

export default {
  async createTask(payload) {
    return instance.post('createTask', {
      title: payload.title,
      parentId: payload.parentId,
      id: payload.id
    });
  },
  async getTodayTasks() {
    return instance.get('getTodayTasks');
  },
  async getTasksNames() {
    return instance.get('getTasksNames');
  }
}