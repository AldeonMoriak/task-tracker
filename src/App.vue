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
      class="w-3/4 mx-auto"
      :currentIndex="currentIndex"
      :isTicking="isTicking"
      v-on:task-clicked="taskCounter"
      v-on:delete-clicked="deleteHandler"
      :direction="dir"
    />
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