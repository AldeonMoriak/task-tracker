<template>
  <div
    :dir="store.dir"
    class="mx-auto max-w-screen-md text-center border-t-4 border-blue-300 bg-blue-50"
    :class="store.tasks.length < 10 ? 'h-screen' : 'h-full'"
  >
    <TopIcons />
    <InputComponent ref="taskInput" class="w-3/4 mx-auto" />
    <div
      class="bg-purple-100 text-xl w-1/3 mx-auto my-2 rounded p-2 text-gray-700 font-vazir"
      v-if="store.totalTime !== '00:00:00'"
    >{{ (store.dir === "rtl" ? "زمان کلی:" : "Total Time:") + " " + store.totalTime }}</div>
    <Tasks ref="tasksRef" />
    <BottomIcons />
  </div>
</template>

<script>
import Tasks from "./components/Tasks.vue";
import InputComponent from "./components/InputComponent.vue";
import BottomIcons from './components/BottomIcons.vue'
import TopIcons from './components/TopIcons.vue'
import { defineComponent, watch, onMounted, ref, onDeactivated } from 'vue'
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
    const taskInput = ref(null)
    const keyboardEventListener = ref(null)
    const tasksRef = ref(null)
    let timer = null

    onDeactivated(() => window.clearTimeout(timer))

    function bottomIconHandler(event) {
      store.whichKeyIsPressed = event.code.toLowerCase();
      timer = setTimeout(() => {
        store.whichKeyIsPressed = '';
      }, 100)
    }

    const keyListenerHandler = (event) => {
      if (event.code.toLowerCase() === "slash" && !store.isFocused && !store.showNameModal && !store.showDescriptionModal) {
        event.preventDefault();
        bottomIconHandler(event)
        taskInput.value.taskInput.focus()
      } else if (event.code.toLowerCase() === "escape") {
        bottomIconHandler(event)
        if (store.isFocused) {
          event.preventDefault();
          taskInput.value.onClearInput();
        } else if (store.showNameModal) {
          event.preventDefault()
          tasksRef.value.modalRef.cancelHandler()
        } else if (store.showDescriptionModal) {
          event.preventDefault()
          tasksRef.value.cancelHandler()
        } else if (store.selectedTaskIndex !== -1) {
          event.preventDefault()
          store.selectedTaskIndex = -1
        }
      } else if (event.code.toLowerCase() === 'arrowdown' && !store.isFocused && !store.showNameModal && !store.showDescriptionModal) {
        if (store.selectedTaskIndex !== -1) {
          bottomIconHandler(event)
          event.preventDefault()
          store.selectedTaskIndex = store.selectedTaskIndex !== store.tasksLength - 1 ? store.selectedTaskIndex + 1 : 0;
        } else {
          bottomIconHandler(event)
          event.preventDefault()
          store.selectedTaskIndex = 0
        }
      } else if (event.code.toLowerCase() === 'arrowup' && !store.isFocused && !store.showNameModal && !store.showDescriptionModal) {
        if (store.selectedTaskIndex !== -1) {
          bottomIconHandler(event)
          event.preventDefault()
          store.selectedTaskIndex = store.selectedTaskIndex !== 0 ? store.selectedTaskIndex - 1 : store.tasksLength - 1;
        } else {
          bottomIconHandler(event)
          event.preventDefault()
          store.selectedTaskIndex = store.tasksLength - 1
        }
      } else if (event.code.toLowerCase() === 'space' && !store.isFocused && !store.showNameModal && !store.showDescriptionModal) {
        if (store.selectedTaskIndex !== -1) {
          bottomIconHandler(event)
          event.preventDefault()
          store.tasks[store.selectedTaskIndex].isTicking ? store.toggleTask(store.selectedTaskIndex, 'stop') : store.toggleTask(store.selectedTaskIndex, 'start')
        }
      }
    }

    onMounted(() => {
      keyboardEventListener.value = addEventListener(
        "keydown",
        keyListenerHandler
      );
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
    return { store, taskInput, tasksRef }
  }
});
</script>