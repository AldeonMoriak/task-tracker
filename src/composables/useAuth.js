import { ref, inject } from "vue";
import api from "../api/auth";
import { useTask } from "../stores/tasks";

export default function useAuth() {
  const username = ref("");
  const password = ref("");
  const showAlert = ref(false);
  const alertMessage = ref("");
  const alertType = ref("");
  const timer = ref(null);
  const store = useTask();
  const homeLink = ref(null);
  const enableButton = ref(true);

  const axiosCall = async (url) => {
    if (!username.value || !password.value) {
      clearTimeout(timer.value);
      alertType.value = "error";
      alertMessage.value = "مقادیر وارد نشده است.";
      showAlert.value = true;
      timer.value = setTimeout(() => {
        showAlert.value = false;
      }, 6000);
      return;
    }
    enableButton.value = false;
    await api
      .authenticate({ password: password.value, username: username.value }, url)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          clearTimeout(timer.value);
          alertType.value = "success";
          alertMessage.value = res.data.message;
          showAlert.value = true;
          timer.value = setTimeout(() => {
            showAlert.value = false;
            homeLink.value.$el.click();
          }, 4000);
          localStorage.setItem("access_token", res.data.access_token);
          store.token = res.data.access_token;
        } else {
          enableButton.value = true;
          clearTimeout(timer.value);
          alertType.value = "error";
          alertMessage.value = res.data.message;
          showAlert.value = true;
          timer.value = setTimeout(() => {
            showAlert.value = false;
          }, 6000);
        }
      })
      .catch((err) => {
        enableButton.value = true;
        clearTimeout(timer.value);
        alertType.value = "error";
        alertMessage.value = err.message;
        showAlert.value = true;
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
    alertType,
    homeLink,
    enableButton,
  };
}
