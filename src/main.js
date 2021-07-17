import { createApp, h } from 'vue'
import App from './pages/App.vue'
import History from './pages/History.vue'
import NotFound from './pages/NotFound.vue'
import Signup from './pages/Signup.vue'
import 'virtual:windi.css'
import './assets/windi.css'
import {pinia} from './stores'

const routes = {
  '/task-tracker/': App,
  '/task-tracker/history': History,
  '/task-tracker/signup': Signup,
}

const SimpleRouter = {
  data: () => ({
    currentRoute: window.location.pathname
  }),

  computed: {
    CurrentComponent() {
      return routes[this.currentRoute] || NotFound
    }
  },

  render() {
    return h(this.CurrentComponent)
  }
}

createApp(SimpleRouter).use(pinia).mount('#app')