<template>
  <header class="flex mt-4 items-center font-vazir">
    <div class="flex">
      <input
        type="text"
        ref="taskInput"
        v-model="taskName"
        :placeholder="direction === 'rtl' ? 'عنوان تسک' : 'Enter a task...'"
        @focus="isFocused = true"
        @blur="isFocused = false"
        class="
          border border-blue-300
          bg-transparent
          focus:(ring
          ring-blue-300)
          rounded
          w-42
          sm:w-64
          top-4
          bg-gray-50
          px-2
        "
        @keypress.enter="insertTaskHandler"
      />
      <p class="-mx-5 text-gray-300 px-1">/</p>
    </div>

    <svg
      viewBox="0 0 24 24"
      fill="none"
      class="
        mx-8
        h-6
        w-6
        p-1
        text-green-500
        cursor-pointer
        bg-green-100
        rounded-full
        hover:(bg-green-200
        text-green-600)
        duration-500
        ease-in-out
      "
      @click="insertTaskHandler"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z"
        fill="currentColor"
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
      isFocused: false,
      keyboardEventListener: null,
    };
  },
  mounted() {
    this.keyboardEventListener = addEventListener(
      "keydown",
      this.keyListenerHandler
    );
  },
  unmounted() {
    removeEventListener("keydown", this.keyboardEventListener);
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
      if (event.code.toLowerCase() === "slash" && !this.isFocused) {
        this.$emit("key-pressed", "slash");
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