import { createApp, h } from "vue";
import "virtual:windi.css";
import "./assets/windi.css";
import { pinia } from "./stores";
import routes from "./routes";
import NotFound from "./pages/NotFound.vue";

const SimpleRouter = {
  data: () => ({
    currentRoute: window.location.pathname,
    baseUrl: "localhost:6000/",
    //'http://backend-task-tracker.herokuapp.com/'
  }),

  computed: {
    CurrentComponent() {
      const matchingPage = routes[this.currentRoute].component || NotFound;
      return matchingPage;
    },
  },

  created() {
    window.addEventListener("popstate", () => {
      this.currentRoute = window.location.pathname;
    });
  },

  render() {
    return h(this.CurrentComponent);
  },
};

createApp(SimpleRouter).use(pinia).mount("#app");
