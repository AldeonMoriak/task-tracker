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
  computed: {},

  methods: {
    changeAddress(href) {
      this.currentRoute = href !== '/' ? "/task-tracker/" + href : '/task-tracker/';
      window.history.pushState(
        null,
        this.currentRoute,
        href !== '/' ? "/task-tracker/" + href : '/task-tracker/'
      );
    },
    returnCurrentComponent() {
      const matchingPage = routes[this.currentRoute].component || NotFound;
      if (
        !localStorage.getItem("access_token") &&
        this.currentRoute !== "/task-tracker/login" &&
        this.currentRoute !== "/task-tracker/signup"
      )
        this.changeAddress("login");
      return matchingPage;
    },
  },

  mounted() {
    window.addEventListener("popstate", () => {
      this.changeAddress(window.location.pathname.split("/task-tracker/")[1]);
    });
  },

  render() {
    return h(this.returnCurrentComponent());
  },
};

createApp(SimpleRouter).use(pinia).mount("#app");
