import { ref, onDeactivated } from "vue";

export default function useError() {
  const alertType = ref("");
  const alertMessage = ref("");
  const showAlert = ref(false);
  let timeout = null;

  onDeactivated(() => clearTimeout(timeout));

  const showError = (error) => {
    alertType.value = error.type;
    alertMessage.value = error.message;
    showAlert.value = true;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      showAlert.value = false;
      alertType.value = "";
      alertMessage.value = "";
    }, 6000);
  };
  return { showError, alertType, alertMessage, showAlert };
}
