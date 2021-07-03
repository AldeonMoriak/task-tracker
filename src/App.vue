<template>
  <div
    :dir="store.dir"
    class="mx-auto max-w-screen-md text-center border-t-4 border-blue-300 bg-blue-50"
    :class="store.tasks.length < 10 ? 'h-screen' : 'h-full'"
  >
    <TopIcons />
    <InputComponent class="w-3/4 mx-auto" />
    <div
      class="bg-purple-100 text-xl w-1/3 mx-auto my-2 rounded p-2 text-gray-500 font-vazir"
      v-if="store.totalTime !== '00:00:00'"
    >{{ (store.dir === "rtl" ? "زمان کلی:" : "Total Time:") + " " + store.totalTime }}</div>
    <Tasks />
    <BottomIcons />
  </div>
</template>

<script>
import Tasks from "./components/Tasks.vue";
import InputComponent from "./components/InputComponent.vue";
import BottomIcons from './components/BottomIcons.vue'
import TopIcons from './components/TopIcons.vue'
import { defineComponent, watch, onMounted } from 'vue'
import { useTask } from './stores/tasks'

export default defineComponent({
  components: {
    Tasks,
    InputComponent,
    BottomIcons,
    TopIcons
  },
  setup() {
    const store = useTask()

    onMounted(() => {
      if (store.isTicking)
        store.counter(store.tasks.findIndex(task => task.isTicking))
    })

    watch(
      () => store.$state,
      (state) => {
        // persist the whole state to the local storage whenever it changes
        localStorage.setItem('taskStore', JSON.stringify(state))
      },
      { deep: true }
    )
    return { store }
  }
});
</script>