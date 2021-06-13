<template>
  <div
    :dir="dir"
    class="
      mx-auto
      max-w-screen-md
      text-center
      border-t-4 border-blue-300
      bg-gray-100
    "
    :class="tasksList.length < 10 ? 'h-screen' : 'h-full'"
  >
    <div class="flex justify-between">
      <a
        href="https://github.com/AldeonMoriak/task-tracker"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="/github.png"
          alt="github link to task tracker"
          :class="dir === 'rtl' ? 'right-1' : 'left-1'"
          class="top-1 cursor-pointer w-8 h-8 opacity-50 hover:opacity-90 m-2"
          width="64px"
          height="64px"
        />
      </a>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        v-if="dir === 'rtl'"
        class="
          h-8
          w-8
          left-1
          top-1
          cursor-pointer
          bg-red-100
          text-red-600
          rounded-full
          p-1
          m-2
          hover:(bg-red-200
          text-red-700)
        "
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        @click="dir = 'ltr'"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        v-if="dir === 'ltr'"
        class="
          h-8
          w-8
          right-1
          top-1
          cursor-pointer
          bg-red-100
          text-red-600
          rounded-full
          p-1
          m-2
          hover:(bg-red-200
          text-red-700)
        "
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        @click="dir = 'rtl'"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
    </div>
    <Header
      :direction="dir"
      v-on:task-inserted="addTask"
      class="w-3/4 mx-auto"
    />
    <Tasks
      :tasks="tasksList"
      class="w-3/4 mx-auto pb-8"
      :currentIndex="currentIndex"
      :isTicking="isTicking"
      v-on:task-clicked="taskCounter"
      v-on:delete-clicked="deleteHandler"
      :direction="dir"
    />
    <div class="fixed bottom-3 flex items-end mr-2">
      <div class="flex flex-col ml-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          class="text-gray-400 opacity-50"
          xmlns="http://www.w3.org/2000/svg"
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
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="text-gray-400 opacity-50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="
          w-16
          h-6
          border-2 border-gray-400
          rounded-md
          ml-2
          text-gray-400
          opacity-50
        "
      >
        <path
          d="M21,9a1,1,0,0,0-1,1v3H4V10a1,1,0,0,0-2,0v4a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V10A1,1,0,0,0,21,9Z"
        />
      </svg>
      <svg
        width="24"
        height="24"
        class="border-2 border-gray-400 rounded-md text-gray-400 opacity-50"
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
    </div>
  </div>
</template>

<script>
import Tasks from "./components/Tasks.vue";
import Header from "./components/Header.vue";

export default {
  components: {
    Tasks,
    Header,
  },
  data() {
    return {
      tasksList: JSON.parse(window.localStorage.getItem("tasks")) ?? [],
      dir: "rtl",
      currentIndex: -1,
      isTicking: false,
      counterInterval: null,
    };
  },
  unmounted() {
    clearInterval(this.counterInterval);
  },
  methods: {
    addTask(value) {
      if (!value || value.length < 1) {
        return;
      }
      this.tasksList.push({
        name: value,
        hours: "00",
        minutes: "00",
        seconds: "00",
      });
    },
    taskCounter(index) {
      if (index === this.currentIndex) {
        this.isTicking = !this.isTicking;
      } else {
        this.isTicking = true;
      }
      clearInterval(this.counterInterval);
      this.currentIndex = index;
      this.counter();
    },
    counter() {
      const index = this.currentIndex;
      if (this.isTicking) {
        this.counterInterval = setInterval(() => {
          +this.tasksList[index].seconds++;
          this.tasksList[index].seconds = this.tasksList[
            index
          ].seconds.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
          if (this.tasksList[index].seconds == 60) {
            this.tasksList[index].seconds = "00";
            this.tasksList[index].minutes++;
            this.tasksList[index].minutes = this.tasksList[
              index
            ].minutes.toLocaleString("en-US", {
              minimumIntegerDigits: 2,
              useGrouping: false,
            });
            if (this.tasksList[index].minutes == 60) {
              this.tasksList[index].minutes = "00";
              +this.tasksList[index].hours++;
              this.tasksList[index].hours = this.tasksList[
                index
              ].hours.toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              });
            }
          }
          this.localStorageHandler();
        }, 1000);
      }
    },
    localStorageHandler() {
      window.localStorage.setItem(
        "tasks",
        JSON.stringify(this.tasksList, null, 2)
      );
    },
    deleteHandler(index) {
      this.tasksList.splice(index, 1);
      if (this.currentIndex > index) this.currentIndex--;
      else if (this.currentIndex == index) {
        this.currentIndex = -1;
        clearInterval(this.counterInterval);
      }
      this.localStorageHandler();
    },
  },
};

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>