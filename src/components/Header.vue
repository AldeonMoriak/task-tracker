<template>
  <header class="flex justify-between mt-4 items-center font-vazir">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="
        h-8
        w-8
        text-green-500
        mt-4
        cursor-pointer
        bg-green-100
        rounded-full
        p-1
        hover:(bg-green-200
        text-green-600
        -translate-y-1
        scale-110)
        animate-flip
        transition
        duration-500
        ease-in-out
        transform
      "
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      @click="showToggleHandler"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <input
      type="text"
      ref="taskInput"
      v-model="taskName"
      class="
        border border-blue-300
        bg-transparent
        ring ring-blue-300
        rounded
        w-64
        top-4
        left-auto
        right-auto
      "
      v-show="show"
      @keypress.enter="insertTaskHandler"
    />
  </header>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      taskName: "",
    };
  },
  methods: {
    showToggleHandler() {
      this.show = true;
      this.taskName = "";
      this.focusInput();
    },
    insertTaskHandler() {
      this.$emit("task-inserted", this.taskName);
      this.show = false;
    },
    focusInput() {
      setTimeout(() => {
        this.$refs.taskInput.focus();
      }, 100);
    },
  },
};
</script>