import { createApp, h } from 'vue'
import 'virtual:windi.css'
import './assets/windi.css'
import {pinia} from './stores'
import routes from './routes'


const SimpleRouter = {
  data: () => ({
    currentRoute: window.location.pathname
  }),

  computed: {
    CurrentComponent() {
      const matchingPage = routes[this.currentRoute] || '404'
      import(`./pages/${matchingPage}.vue`).then((module) => {
        return module;
      });
    }
  },

   created () {
    window.addEventListener('popstate', () => {
      this.currentRoute = window.location.pathname
    })
  },

  render() {
    return h(this.CurrentComponent)
  }
}

createApp(SimpleRouter).use(pinia).mount('#app')