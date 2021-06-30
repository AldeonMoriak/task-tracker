<template>
  <Modal
    v-show="showModal"
    :direction="dir"
    :index="taskIndex"
    v-on:task-name-changed="changeNameHandler"
    ref="modalRef"
  />
  <div
    :dir="dir"
    class="mx-auto max-w-screen-md text-center border-t-4 border-blue-300 bg-blue-50"
    :class="tasksList.length < 10 ? 'h-screen' : 'h-full'"
  >
    <div class="flex justify-between mt-1">
      <a href="https://github.com/AldeonMoriak/task-tracker" target="_blank" rel="noreferrer">
        <img
          src="/github.png"
          alt="github link to task tracker"
          :class="dir === 'rtl' ? 'right-1' : 'left-1'"
          class="top-1 cursor-pointer w-8 h-8 opacity-50 hover:opacity-90 m-2"
          width="64px"
          height="64px"
        />
      </a>
      <div class="has-tooltip">
        <svg
          width="24"
          class="h-8 w-8 left-1 top-1 cursor-pointer bg-gray-50 text-gray-600 rounded-full opacity-50 p-1 m-2 hover:(bg-gray-200 text-gray-700 opacity-100)"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="dir === 'rtl' ? dir = 'ltr' : dir = 'rtl'"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM14.8055 18.4151C17.1228 17.4003 18.7847 15.1667 18.9806 12.525C18.1577 12.9738 17.12 13.3418 15.9371 13.598C15.7882 15.4676 15.3827 17.1371 14.8055 18.4151ZM9.1945 5.58487C7.24725 6.43766 5.76275 8.15106 5.22208 10.244C5.4537 10.4638 5.84813 10.7341 6.44832 11.0008C6.89715 11.2003 7.42053 11.3798 8.00537 11.5297C8.05853 9.20582 8.50349 7.11489 9.1945 5.58487ZM10.1006 13.9108C10.2573 15.3675 10.5852 16.6202 10.9992 17.5517C11.2932 18.2133 11.5916 18.6248 11.8218 18.8439C11.9037 18.9219 11.9629 18.9634 12 18.9848C12.0371 18.9634 12.0963 18.9219 12.1782 18.8439C12.4084 18.6248 12.7068 18.2133 13.0008 17.5517C13.4148 16.6202 13.7427 15.3675 13.8994 13.9108C13.2871 13.9692 12.6516 14 12 14C11.3484 14 10.7129 13.9692 10.1006 13.9108ZM8.06286 13.598C8.21176 15.4676 8.61729 17.1371 9.1945 18.4151C6.8772 17.4003 5.21525 15.1666 5.01939 12.525C5.84231 12.9738 6.88001 13.3418 8.06286 13.598ZM13.9997 11.8896C13.369 11.9609 12.6993 12 12 12C11.3008 12 10.631 11.9609 10.0003 11.8896C10.0135 9.66408 10.4229 7.74504 10.9992 6.44832C11.2932 5.78673 11.5916 5.37516 11.8218 5.15605C11.9037 5.07812 11.9629 5.03659 12 5.01516C12.0371 5.03659 12.0963 5.07812 12.1782 5.15605C12.4084 5.37516 12.7068 5.78673 13.0008 6.44832C13.5771 7.74504 13.9865 9.66408 13.9997 11.8896ZM15.9946 11.5297C15.9415 9.20582 15.4965 7.11489 14.8055 5.58487C16.7528 6.43766 18.2373 8.15107 18.7779 10.244C18.5463 10.4638 18.1519 10.7341 17.5517 11.0008C17.1029 11.2003 16.5795 11.3798 15.9946 11.5297Z"
            fill="currentColor"
          />
        </svg>
        <div class="tooltip tooltip-top" :dir="dir">
          {{
            dir === "rtl"
              ? "English / انگلیسی"
              : "Farsi / فارسی"
          }}
        </div>
      </div>
    </div>
    <Header
      :direction="dir"
      v-on:task-inserted="addTask"
      class="w-3/4 mx-auto"
      v-on:key-pressed="keyHandler"
      v-on:is-focused="focusHandler"
    />
    <div
      class="bg-purple-100 text-xl w-1/3 mx-auto my-2 rounded p-2 text-gray-500 font-vazir"
      v-if="totalTime !== '00:00:00'"
    >{{ (dir === "rtl" ? "زمان کلی:" : "Total Time:") + " " + totalTime }}</div>
    <Tasks
      :tasks="tasksList"
      v-on:show-description="showDescriptionHandler"
      v-on:add-description="addDescriptionHandler"
      class="w-3/4 mx-auto pb-8"
      :currentIndex="currentIndex"
      :isTicking="isTicking"
      v-on:task-clicked="taskCounter"
      v-on:delete-clicked="deleteHandler"
      :direction="dir"
      v-on:key-pressed="keyHandler"
      :is-focused="isFocused"
      v-on:name-clicked="onNameClickHandler"
      ref="tasks"
      :showModal="showModal"
    />
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
            :class="whichKeyIsPressed === 'arrowup' ? 'opacity-100' : ''"
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
            :class="whichKeyIsPressed === 'arrowdown' ? 'opacity-100' : ''"
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
          >{{ dir === "rtl" ? "حرکت بین تسک ها" : "move between tasks" }}</div>
        </div>
      </div>
      <div class="has-tooltip">
        <svg
          id="space"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-16 h-6 border-2 border-gray-600 rounded-md ml-2 text-gray-600 opacity-50 hover:opacity-100"
          :class="whichKeyIsPressed === 'space' ? 'opacity-100' : ''"
        >
          <path
            d="M21,9a1,1,0,0,0-1,1v3H4V10a1,1,0,0,0-2,0v4a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V10A1,1,0,0,0,21,9Z"
          />
        </svg>
        <div
          class="tooltip tooltip-bottom text-left"
        >{{ dir === "rtl" ? "شروع/توقف تایمر" : "play/pause timer" }}</div>
      </div>
      <div class="has-tooltip">
        <svg
          id="slash"
          width="24"
          height="24"
          class="border-2 border-gray-600 rounded-md text-gray-600 opacity-50 hover:opacity-100 ml-2"
          :class="whichKeyIsPressed === 'slash' ? 'opacity-100' : ''"
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
            dir === "rtl"
              ? "ورود عنوان تسک با فشردن این دکمه"
              : "press to enter a task name"
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tasks from "./components/Tasks.vue";
import Header from "./components/Header.vue";
import Modal from "./components/Modal.vue";

export default {
  components: {
    Tasks,
    Header,
    Modal,
  },
  data() {
    return {
      tasksList: JSON.parse(window.localStorage.getItem("tasks")) ?? [],
      dir: "rtl",
      currentIndex: -1,
      isTicking: false,
      counterInterval: null,
      whichKeyIsPressed: "",
      isFocused: false,
      showModal: false,
      taskIndex: -1,
    };
  },
  unmounted() {
    clearInterval(this.counterInterval);
    this.timeoutWiper();
  },
  computed: {
    totalTime() {
      let totalTime = 0;
      this.tasksList
        ? this.tasksList.map(
          (task) =>
          (totalTime =
            +totalTime +
            +task.hours * 60 * 60 +
            +task.minutes * 60 +
            +task.seconds)
        )
        : 0;
      return (
        Math.floor(totalTime / 3600).toLocaleString(undefined, {
          minimumIntegerDigits: 2,
        }) +
        ":" +
        Math.floor((totalTime % 3600) / 60).toLocaleString(undefined, {
          minimumIntegerDigits: 2,
        }) +
        ":" +
        ((totalTime % 3600) % 60).toLocaleString(undefined, {
          minimumIntegerDigits: 2,
        })
      );
    },
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
        description: {
          isShown: false,
          text: ''
        }
      });
      this.localStorageHandler();
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
      if (this.isTicking && this.currentIndex !== -1) {
        this.counterInterval = setInterval(() => {
          +this.tasksList[this.currentIndex].seconds++;
          this.tasksList[this.currentIndex].seconds = this.tasksList[
            this.currentIndex
          ].seconds.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
          if (this.tasksList[this.currentIndex].seconds == 60) {
            this.tasksList[this.currentIndex].seconds = "00";
            this.tasksList[this.currentIndex].minutes++;
            this.tasksList[this.currentIndex].minutes = this.tasksList[
              this.currentIndex
            ].minutes.toLocaleString("en-US", {
              minimumIntegerDigits: 2,
              useGrouping: false,
            });
            if (this.tasksList[this.currentIndex].minutes == 60) {
              this.tasksList[this.currentIndex].minutes = "00";
              +this.tasksList[this.currentIndex].hours++;
              this.tasksList[this.currentIndex].hours = this.tasksList[
                this.currentIndex
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
    keyHandler(key) {
      this.timeoutWiper();
      this.whichKeyIsPressed = key;
      this.timer = setTimeout(() => {
        this.whichKeyIsPressed = "";
      }, 200);
    },
    timeoutWiper() {
      clearTimeout(this.timer);
    },
    focusHandler(value) {
      this.isFocused = value;
    },
    changeNameHandler(value) {
      if (value && value.name) {
        this.tasksList[value.index].name = value.name;
      }
      this.showModal = false;
      this.taskIndex = -1
      this.localStorageHandler();
    },
    onNameClickHandler(index) {
      this.showModal = true;
      this.taskIndex = index;
      this.$refs.tasks.selectedTask = -1
      this.$refs.modalRef.focusHandler();
      this.$refs.modalRef.taskNewName = this.tasksList[index].name;
    },
    showDescriptionHandler(value) {
      this.tasksList[value.index].description.isShown = value.show
    },
    addDescriptionHandler(value) {
      this.tasksList[value.index].description.text = value.text
      this.localStorageHandler();
    }
  },
};
</script>