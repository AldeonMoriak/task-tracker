<template>
  <header class="flex mt-4 items-center font-vazir">
    <div class="relative w-full mb-24 flex items-center justify-center">
      <div class="max-w-24rem absolute top-0 w-full">
        <input
          type="text"
          ref="taskInput"
          v-model="newTaskName"
          :placeholder="store.dir === 'rtl' ? 'عنوان تسک' : 'Enter a task...'"
          @focus="focusHandler"
          @blur="blurHandler"
          class="block resize-none overflow-hidden w-full bg-white focus:outline-none w-full text-seven leading-seven font-vazir font-bold-body-weight flex py-4 px-8 rounded-xl border-2 border-transparent text-gray-900 transition-colors duration-200 placeholder-gray-400"
          @keypress.enter="insertTaskHandler"
        />
        <div
          class="absolute top-0 p-2"
          :class="{ 'left-0': store.dir === 'rtl', 'right-0': store.dir === 'ltr' }"
        >
          <button
            v-show="newTaskName && store.isFocused"
            type="button"
            class="focus:outline-none bg-gray-50 border-2 text-green-400 border-white rounded-2xl p-2 hover:text-green-700"
            @click="insertTaskHandler"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            type="button"
            v-show="!store.isFocused"
            class="focus:outline-none bg-gray-50 border-2 text-gray-400 border-white rounded-2xl p-2 cursor-default"
          >
            <svg
              id="slash"
              width="24"
              height="24"
              class="border-2 rounded-md"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14.526 6.10576C15.0265 6.33917 15.2667 6.88343 15.0625 7.3214L9.88541 18.4237C9.68118 18.8616 9.10985 19.0275 8.60931 18.7941C8.10877 18.5607 7.86857 18.0164 8.0728 17.5784L13.2499 6.47616C13.4541 6.03819 14.0254 5.87235 14.526 6.10576Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import { defineComponent, onDeactivated, ref } from 'vue'
import { useTask } from '../stores/tasks'
export default defineComponent({
  setup() {
    const newTaskName = ref('')
    const store = useTask()
    const keyboardEventListener = ref(null)
    const taskInput = ref(null)

    const focusHandler = () => {
      store.isFocused = true
    }

    const blurHandler = () => {
      keyboardEventListener.value = setTimeout(() => {
        store.isFocused = false;
      }, 100)
    }

    onDeactivated(() => {
      window.clearTimeout(keyboardEventListener.value)
    })

    const onClearInput = () => {
      newTaskName.value = ''
      taskInput.value.blur()
    }

    const insertTaskHandler = () => {
      store.addTask(newTaskName.value)
      newTaskName.value = "";
      taskInput.value.blur();
    }


    return {
      newTaskName,
      store,
      focusHandler,
      blurHandler,
      insertTaskHandler,
      taskInput,
      onClearInput
    }
  },
});
</script>