<template>
  <div v-if="tasks && tasks.length > 0" class="mt-4 font-vazir">
    <teleport to="body">
      <div
        v-if="modalOpen"
        :dir="direction"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>
      <div
        v-if="modalOpen"
        class="modal font-vazir absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center"
      >
        <div
          class="flex flex-col items-center justify-center p-5 w-72 h-72 rounded-md bg-white w-1/5 h-1/3"
        >
          <textarea
            :dir="direction"
            v-model="descriptionNewValue"
            class="p-2 my-2 rounded-md bg-gray-200 w-full h-full"
          />
          <div class="flex">
            <button
              type="button"
              @click="saveDescriptionHandler"
              class="rounded-md bg-green-200 text-green-800 px-2 py-1 hover:(bg-green-300 text-green-900)"
            >{{ direction === 'rtl' ? 'ثبت' : 'Save' }}</button>
            <button
              type="button"
              @click="cancelHandler"
              class="mx-2 rounded-md bg-red-200 text-red-800 px-2 py-1 hover:(bg-red-300 text-red-900)"
            >{{ direction === 'rtl' ? 'بازگشت' : 'Cancel' }}</button>
          </div>
        </div>
      </div>
    </teleport>
    <transition-group name="list-complete" tag="div">
      <div
        v-for="(task, index) in tasks"
        :id="index"
        :key="index"
        @click="selectedTask = index"
        class="flex flex-col ring p-4 rounded mb-4 list-complete-item"
        :class="classNames(index)"
      >
        <div class="flex justify-between">
          <div class="flex">
            <span class @click.stop="$emit('name-clicked', index)">{{ task.name }}</span>
            <svg
              v-if="!task.description.isShown"
              id="chevron-down"
              class="mx-2 text-blue-700 hover:(bg-blue-200 ) rounded-md w-5 h-5 cursor-pointer transition ease-in-out duration-200"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              @click.stop="$emit('show-description', { index, show: true })"
            >
              <path
                d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z"
                fill="currentColor"
              />
            </svg>
            <svg
              v-else
              id="chevron-up"
              class="mx-2 text-blue-700 hover:(bg-blue-200) rounded-md w-5 h-5 cursor-pointer transition ease-in-out duration-200"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              @click.stop="$emit('show-description', { index, show: false })"
            >
              <path
                d="M17.6569 16.2427L19.0711 14.8285L12.0001 7.75739L4.92896 14.8285L6.34317 16.2427L12.0001 10.5858L17.6569 16.2427Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="flex">
            <span>
              {{
                task.hours + ":" + task.minutes + ":" + task.seconds
              }}
            </span>
            <div @click="togglePlayHandler(index)" class="flex justify-between">
              <svg
                v-if="!isTicking || currentIndex != index"
                aria-label="play button"
                class="h-6 w-6 mx-5 text-green-600 bg-green-200 rounded-full hover:(bg-green-300 text-green-800) cursor-pointer transition ease-in duration-300"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="currentColor" />
              </svg>
              <svg
                v-else
                aria-label="pause button"
                class="transition ease-in-out duration-500 h-6 w-6 mx-5 text-pink-600 bg-pink-200 rounded-full hover:(bg-pink-300 text-pink-800) cursor-pointer"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 7H8V17H11V7Z" fill="currentColor" />
                <path d="M13 17H16V7H13V17Z" fill="currentColor" />
              </svg>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 p-1 text-red-600 bg-red-200 rounded-full hover:(bg-red-300 text-red-800) cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              @click.stop="$emit('delete-clicked', index)"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
        </div>
        <div
          v-bind:class="classObject"
          class="bg-gray-100 my-2 rounded-md p-2 transition ease-in-out duration-500 cursor-pointer text-gray-500"
          v-show="task.description.isShown"
          @click.stop="modalOpenHandler(task, index)"
        >{{ descriptionText(task) }}</div>
      </div>
    </transition-group>
  </div>
  <div v-else>
    <div
      v-if="direction === 'rtl'"
      class="text-red-500 font-vazir text-xl lg:text-3xl font-bold text-center my-5"
    >تسکی که میخوای رو اضافه کن!</div>
    <div v-else class="text-red-500 font-semibold text-xl lg:text-3xl text-center my-5">Add a task!</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyboardEventListener: null,
      selectedTask: -1,
      modalOpen: false,
      descriptionNewValue: '',
      descriptionIndex: -1,
    };
  },
  props: {
    tasks: {
      type: Array,
      default() {
        return [];
      },
    },
    currentIndex: {
      type: Number,
      default: -1,
    },
    isTicking: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: "rtl",
    },
    isFocused: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.keyboardEventListener = addEventListener("keydown", this.keyListener);
  },
  unmounted() {
    removeEventListener("keydown", this.keyboardEventListener);
  },
  watch: {
    isFocused(value) {
      this.selectedTask = value ? -1 : this.selectedTask;
    },
  },
  computed: {
    classObject: function() {
      return {
        'text-right': this.direction === 'rtl',
        'text-left': this.direction !== 'rtl'
      }
    }
  },
  methods: {
    classNames(index) {
      let classNames = "";
      const background = this.isTicking
        ? " "
        : index % 2 === 0
          ? " bg-blue-100"
          : " bg-pink-100";
      classNames = classNames + background;
      if (this.currentIndex === index && this.isTicking) {
        classNames = classNames + " ring-green-300 bg-green-100";
      } else if (this.selectedTask === index) {
        const selected = " ring-red-500";
        classNames = classNames + selected;
      } else {
        const ringColor = index % 2 === 0 ? " ring-blue-200" : " ring-pink-200";
        classNames = classNames + ringColor;
      }
      return classNames;
    },
    keyListener(event) {
      if (event.code.toLowerCase() === "arrowdown") {
        this.$emit("key-pressed", "arrowdown");
        event.preventDefault();
        this.moveHandler("down");
      } else if (event.code.toLowerCase() === "arrowup") {
        this.$emit("key-pressed", "arrowup");
        event.preventDefault();
        this.moveHandler("up");
      } else if (
        event.code.toLowerCase() === "space" &&
        this.selectedTask !== -1
      ) {
        this.$emit("key-pressed", "space");
        event.preventDefault();
        this.togglePlayHandler(this.selectedTask);
      } else if (event.code.toLowerCase() === "escape") {
        this.$emit("key-pressed", "escape");
        event.preventDefault();
        this.selectedTask = -1;
      }
    },
    moveHandler(direction) {
      if (direction === "down") {
        this.selectedTask++;
        if (this.selectedTask > this.tasks.length - 1) {
          this.selectedTask = 0;
        }
      } else if (direction === "up") {
        this.selectedTask--;
        if (this.selectedTask < 0) {
          this.selectedTask = this.tasks.length - 1;
        }
      }
      document.getElementById(this.selectedTask).scrollIntoView();
    },
    togglePlayHandler(index) {
      this.$emit("task-clicked", index);
    },
    descriptionText(task) {
      return task.description.text ? task.description.text : this.direction === 'rtl' ? 'توضیحات...' : 'Add a description...';
    },
    consoleHandler() {
      console.log(this.descriptionNewValue)
    },
    cancelHandler() {
      this.modalOpen = false;
      this.descriptionNewValue = ''
      this.descriptionIndex = -1
    },
    saveDescriptionHandler() {
      this.$emit('add-description', { text: this.descriptionNewValue, index: this.descriptionIndex });
      this.cancelHandler();
    },
    modalOpenHandler(task, index) {
      this.selectedTask = -1
      this.descriptionIndex = index
      this.modalOpen = true;
      this.descriptionNewValue = task.description.text
    }
  },
};
</script>

<style scoped>
.list-complete-item {
  transition: all 0.8s ease;
}

.list-complete-enter-from,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-complete-leave-active {
  position: relative;
}
</style>