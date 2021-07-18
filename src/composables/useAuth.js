import { ref } from 'vue';
import api from '../api/auth'
import {useTask} from '../stores/tasks'

export default function useAuth() {
  const username = ref("");
  const password = ref("");
  const showAlert = ref(false);
  const alertMessage = ref('');
  const alertType = ref('');
  const timer = ref(null);
  const store = useTask();

  const axiosCall = async (url) => {
    await api.authenticate({ password: password.value, username: username.value }, url).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        clearTimeout(timer.value);
        alertType.value = 'success'
        alertMessage.value = res.data.message;
        showAlert.value = true
        timer.value = setTimeout(() => {
          showAlert.value = false;
        }, 6000);
        localStorage.setItem('access_token', res.data.access_token);
        store.token = res.data.access_token;
      } else {
        clearTimeout(timer.value);
        alertType.value = 'error'
        alertMessage.value = res.data.message;
        showAlert.value = true
        timer.value = setTimeout(() => {
          showAlert.value = false;
        }, 6000);

      }
    })
      .catch((err) => {
        clearTimeout(timer.value);
        alertType.value = 'error'
        alertMessage.value = err.message;
        showAlert.value = true
        timer.value = setTimeout(() => {
          showAlert.value = false;
        }, 6000);
      });
  };

  return {
    username,
    password,
    axiosCall,
    showAlert,
    alertMessage,
    alertType
  }
}
