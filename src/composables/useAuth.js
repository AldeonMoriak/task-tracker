import axios from 'axios'
import { ref } from 'vue';

export default function useAuth() {
  const username = ref("");
  const password = ref("");

  const axiosCall = async (url) => {
    await axios
      .post("http://backend-task-tracker.herokuapp.com/auth/" + url, {
        password: password.value,
        username: username.value,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  
  return {
    username,
    password,
    axiosCall
  }
}
