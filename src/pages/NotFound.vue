<template>
  <div class="flex flex-col h-screen">
    <div class="m-auto">
      <h1 class="font-vazir font-bold text-center">Page Not Found</h1>
      <button
        @click="escape"
        class="bg-purple-50 text-purple-600 hover:(bg-purple-100 text-purple-700) p-1 rounded mx-auto mt-3"
      >Get me out of here!</button>
    </div>
  </div>
</template>

<script setup>
const escape = () => {
  window.location.href = "/task-tracker/"
}
</script>