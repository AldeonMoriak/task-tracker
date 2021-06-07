<template>
  <header class="flex mt-4 items-center font-vazir">
    <div class="flex">
      <input
        type="text"
        ref="taskInput"
        v-model="taskName"
        class="border border-blue-300 bg-transparent ring ring-blue-300 rounded w-64 top-4"
        @keypress.enter="insertTaskHandler"
      />
      <p class="-mx-5 text-grey-300 px-1">/</p>
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="mx-8 h-8 w-8 text-green-500 cursor-pointer bg-green-100 rounded-full p-1 hover:(bg-green-200 text-green-600 -translate-y-1 scale-110) animate-flip transition duration-500 ease-in-out transform"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      @click="insertTaskHandler"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </header>
</template>
<script>
export default {
  props: {
    direction: {
      type: String,
      default: "rtl",
    },
  },
  data() {
    return {
      taskName: "",
      keyboardEventListener: null,
    };
  },
  mounted() {
    this.keyboardEventListener = addEventListener(
      "keydown",
      this.keyListenerHandler
    );
  },
  methods: {
    showToggleHandler() {
      this.focusInput();
    },
    insertTaskHandler() {
      this.$emit("task-inserted", this.taskName);
      this.taskName = "";
    },
    keyListenerHandler(event) {
      if (event.code.toLowerCase() === "slash") {
        event.preventDefault();
        this.focusInput();
      }
    },
    focusInput() {
      this.$refs.taskInput.focus();
    },
  },
};
</script>