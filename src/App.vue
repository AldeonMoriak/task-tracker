<template>
  <div
    class="mx-auto max-w-screen-md border border-blue-300 text-center h-screen"
  >
    <Header />
    <Tasks msg="Hello Vue 3 + Vite" />
  </div>
</template>

<script setup>
import Tasks from "./components/Tasks.vue";
import Header from "./components/Header.vue";

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>