<template>
  <div class="fixed bottom-3 flex items-end mr-2">
    <div class="flex flex-col ml-2">
      <div class="has-tooltip">
        <svg
          id="arrow-up"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          class="text-gray-600 opacity-50 hover:opacity-100"
          xmlns="http://www.w3.org/2000/svg"
          :class="store.whichKeyIsPressed === 'arrowup' ? 'opacity-100' : ''"
        >
          <path
            d="M14.8543 11.9741L16.2686 10.5599L12.0259 6.31724L7.78327 10.5599L9.19749 11.9741L11.0259 10.1457V17.6828H13.0259V10.1457L14.8543 11.9741Z"
            fill="currentColor"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1 19C1 21.2091 2.79086 23 5 23H19C21.2091 23 23 21.2091 23 19V5C23 2.79086 21.2091 1 19 1H5C2.79086 1 1 2.79086 1 5V19ZM5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z"
            fill="currentColor"
          />
        </svg>
        <svg
          id="arrow-down"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="text-gray-600 opacity-50 hover:opacity-100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :class="store.whichKeyIsPressed === 'arrowdown' ? 'opacity-100' : ''"
        >
          <path
            d="M14.8284 12.0259L16.2426 13.4402L12 17.6828L7.75733 13.4402L9.17155 12.0259L11 13.8544V6.31724H13V13.8544L14.8284 12.0259Z"
            fill="currentColor"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1 5C1 2.79086 2.79086 1 5 1H19C21.2091 1 23 2.79086 23 5V19C23 21.2091 21.2091 23 19 23H5C2.79086 23 1 21.2091 1 19V5ZM5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z"
            fill="currentColor"
          />
        </svg>
        <div
          class="tooltip tooltip-bottom text-left"
        >{{ store.dir === "rtl" ? "حرکت بین تسک ها" : "move between tasks" }}</div>
      </div>
    </div>
    <div class="has-tooltip">
      <svg
        id="space"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-16 h-6 border-2 border-gray-600 rounded-md ml-2 text-gray-600 opacity-50 hover:opacity-100"
        :class="store.whichKeyIsPressed === 'space' ? 'opacity-100' : ''"
      >
        <path
          d="M21,9a1,1,0,0,0-1,1v3H4V10a1,1,0,0,0-2,0v4a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V10A1,1,0,0,0,21,9Z"
        />
      </svg>
      <div
        class="tooltip tooltip-bottom text-left"
      >{{ store.dir === "rtl" ? "شروع/توقف تایمر" : "play/pause timer" }}</div>
    </div>
    <div class="has-tooltip">
      <svg
        id="slash"
        width="24"
        height="24"
        class="border-2 border-gray-600 rounded-md text-gray-600 opacity-50 hover:opacity-100 ml-2"
        :class="store.whichKeyIsPressed === 'slash' ? 'opacity-100' : ''"
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
      <div class="tooltip tooltip-bottom text-left">
        {{
          store.dir === "rtl"
            ? "ورود عنوان تسک با فشردن این دکمه"
            : "press to enter a task name"
        }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useTask } from '../stores/tasks'

export default defineComponent({
  setup() {
    const store = useTask();

    return { store }
  }
})

</script>