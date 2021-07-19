<template>
  <div
    :dir="store.dir"
    class="mx-auto max-w-screen-md text-center border-t-4 border-blue-300 bg-blue-50"
    :class="store.tasks.length < 10 ? 'h-screen' : 'h-full'"
  >
    <div
      class="fixed w-40 mb-24 flex items-center justify-center"
      v-if="store.totalTime !== '00:00:00' && store.showTotalTime"
    >
      <div class="max-w-24rem absolute top-0 w-full">
        <div
          class="block resize-none overflow-hidden w-full bg-white w-full font-vazir border-b font-bold-body-weight flex py-4 px-8 text-gray-900"
          :class="store.dir === 'rtl' ? 'border-l rounded-bl-lg' : 'border-r rounded-br-lg'"
        >{{ store.totalTime }}</div>
        <div
          class="absolute top-0 p-2"
          :class="{ 'left-0': store.dir === 'rtl', 'right-0': store.dir === 'ltr' }"
        ></div>
      </div>
      <button
        type="button"
        class="focus:outline-none bg-gray-50 border-2 text-green-400 border-white rounded-2xl p-2 hover:text-green-700"
      >
        <svg
          width="24"
          height="24"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>

    <div class="fixed" v-if="!store.showTotalTime">
      <svg
        width="24"
        height="24"
        class="w-5 h-5 bg-pink-500 text-white rounded-1 hover:(w-8 h-8 mt-0 cursor-pointer) transition-all duration-75 ease-in-out sticky -mt-3 mr-16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        @click="store.showTotalTime = true"
      >
        <path d="M9 7H11V12H16V14H9V7Z" fill="currentColor" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
          fill="currentColor"
        />
      </svg>
    </div>
    <TopIcons />
    <InputComponent ref="taskInput" class="w-3/4 mx-auto" />
    <Tasks ref="tasksRef" />
    <ReloadPrompt />
    <BottomIcons />
  </div>
</template>

<script>
import Tasks from "../components/Tasks.vue";
import InputComponent from "../components/InputComponent.vue";
import BottomIcons from '../components/BottomIcons.vue'
import TopIcons from '../components/TopIcons.vue'
import ReloadPrompt from '../components/ReloadPrompt.vue'
import { defineComponent, watch, onMounted, ref, onDeactivated } from 'vue'
import { useTask } from '../stores/tasks'

export default defineComponent({
  components: {
    Tasks,
    InputComponent,
    BottomIcons,
    TopIcons,
    ReloadPrompt
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