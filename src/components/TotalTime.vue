<template>
  <div class="relative z-20">
  <div
    class="fixed w-40 mb-24 flex justify-end transition duration-500 ease-in-out z-10"
    :class="store.showTotalTime ? 'show' : '-mt-40 hide'"
    v-if="store.totalTime !== '00:00:00'"
  >
    <div class="max-w-24rem absolute top-0 w-full">
      <div
        class="block resize-none overflow-hidden w-full bg-white w-full font-vazir border-b font-bold-body-weight flex py-4 px-8 text-gray-900"
        :class="store.dir === 'rtl' ? 'border-l rounded-bl-lg' : 'border-r rounded-br-lg'"
      >{{ store.totalTime }}</div>
      <div
        class="absolute top-0 p-2"
        :class="{ 'left-0': store.dir === 'rtl', 'right-0': store.dir === 'ltr' }"
      ></div>
    </div>
    <button
      type="button"
      class="text-red-400 transition duration-500 ease-in-out p-2 rounded-1 hover:text-red-700 z-10"
      @click="store.showTotalTime = false"
    >
      <svg
        width="24"
        height="24"
        class="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
          fill="currentColor"
        />
      </svg>
    </button>
  </div>

  <div class="fixed" :class="!store.showTotalTime ? 'show' : 'hide'">
    <svg
      width="24"
      height="24"
      class="w-5 h-5 bg-rose-500 text-white rounded-1 hover:(w-8 h-8 mt-0 cursor-pointer) transition-all duration-75 ease-in-out sticky -mt-3"
      :class="store.dir === 'ltr' ? 'mr-16' : 'ml-16'"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      @click="store.showTotalTime = true"
    >
      <path d="M9 7H11V12H16V14H9V7Z" fill="currentColor" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
        fill="currentColor"
      />
    </svg>
  </div>
  </div>
</template>

<script setup>
import { useTask } from '../stores/tasks'

const store = useTask();
</script>

<style scoped>
@keyframes hide {
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(-120vw);
  }
}

@keyframes show {
  0% {
    transform: translateY(-120vw);
  }
  80% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0vw);
  }
}

.hide {
  animation: hide 0.5s forwards ease-in-out;
  animation-delay: 0.2s;
}

.show {
  animation: show 0.5s forwards ease-in-out;
}
</style>