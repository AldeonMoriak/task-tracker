<template>
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 text-pink-600 mx-12 mt-4 cursor-pointer"
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
      ref="task"
      v-model="taskName"
      class="border border-blue-300 ring ring-blue-300 rounded w-64 fixed top-4 left-1/3"
      v-if="show"
      @keypress.enter="insertTaskHandler"
    />
  </div>
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
      this.show = !this.show;
      this.focusInput();
      this.taskName = "";
    },
    insertTaskHandler() {
      this.$emit("task-inserted", this.taskName);
      this.showToggleHandler();
    },
    focusInput() {
      this.$refs.task.focus();
    },
  },
};
</script>