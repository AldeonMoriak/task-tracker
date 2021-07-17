import App from "./pages/App.vue";
import History from "./pages/History.vue";
import Login from "./pages/Login.vue";
import Signup from "./pages/Signup.vue";
export default {
  "/task-tracker/": { component: App, name: "App" },
  "/task-tracker/history": { component: History, name: "History" },
  "/task-tracker/signup": { component: Signup, name: "Signup" },
  "/task-tracker/login": { component: Login, name: "Login" },
};
