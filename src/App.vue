<template>
  <div
    class="mx-auto max-w-screen-md border border-blue-300 text-center h-screen"
  >
    <Header v-on:task-inserted="addTask" />
    <Tasks msg="Hello Vue 3 + Vite" />
    <div v-for="(task, index) in tasks" :key="index">{{ task }}</div>
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
      tasks: [],
    };
  },
  methods: {
    addTask(value) {
      this.tasks.push(value);
      console.log(this.tasks);
    },
  },
};

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>