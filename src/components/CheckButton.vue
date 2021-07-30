<template>
  <div class="flex items-end mr-2">
    <div class="fixed bottom-3 flex flex-col ml-2">
      <div class="has-tooltip">
        <button
          v-if="!loading"
          class="bg-transparent"
          type="button"
          @click="check"
          :disabled="loading"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            focusable="false"
            width="1em"
            height="1em"
            style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 32 32"
            class="cursor-pointer w-5 h-5"
          >
            <path
              d="M7 5.21a.77.77 0 0 1-.46-1.38A15.46 15.46 0 0 1 16 1c2.66 0 6.48.45 9.5 2.62a.77.77 0 0 1 .18 1.07a.78.78 0 0 1-1.08.17A15 15 0 0 0 16 2.53a14 14 0 0 0-8.5 2.52a.74.74 0 0 1-.5.16z"
              fill="#626262"
            />
            <path
              d="M28.23 12.26a.78.78 0 0 1-.63-.33C25.87 9.49 22.78 6.24 16 6.24a14 14 0 0 0-11.63 5.7a.77.77 0 0 1-1.07.17a.76.76 0 0 1-.15-1.11A15.54 15.54 0 0 1 16 4.71c5.61 0 9.81 2.08 12.84 6.34a.77.77 0 0 1-.19 1.07a.79.79 0 0 1-.42.14z"
              fill="#626262"
            />
            <path
              d="M12.28 31a.78.78 0 0 1-.72-.49a.75.75 0 0 1 .44-1c4.37-1.68 7-5.12 7-9.21a2.8 2.8 0 0 0-3-3c-1.86 0-2.76 1-3 3.35a4.27 4.27 0 0 1-4.52 3.83a4.27 4.27 0 0 1-4.32-4.59A11.71 11.71 0 0 1 16 8.39a12 12 0 0 1 12 11.93a18.66 18.66 0 0 1-1.39 6.5a.78.78 0 0 1-1 .41a.76.76 0 0 1-.41-1a17.25 17.25 0 0 0 1.27-5.91A10.45 10.45 0 0 0 16 9.92a10.18 10.18 0 0 0-10.38 10a2.77 2.77 0 0 0 2.79 3.06a2.74 2.74 0 0 0 3-2.48c.36-3.11 1.89-4.69 4.56-4.69a4.31 4.31 0 0 1 4.52 4.56c0 4.74-3 8.72-8 10.63a.92.92 0 0 1-.21 0z"
              fill="#626262"
            />
            <path
              d="M19.77 30.28a.81.81 0 0 1-.52-.2a.76.76 0 0 1 0-1.08a12.63 12.63 0 0 0 3.54-8.68c0-1.56-.48-6.65-6.7-6.65a6.83 6.83 0 0 0-4.94 1.87A6.17 6.17 0 0 0 9.32 20a.77.77 0 0 1-.77.76a.76.76 0 0 1-.77-.76A7.73 7.73 0 0 1 10 14.46a8.34 8.34 0 0 1 6-2.32c6.08 0 8.24 4.4 8.24 8.18a14.09 14.09 0 0 1-3.9 9.68a.75.75 0 0 1-.57.28z"
              fill="#626262"
            />
            <path
              d="M8.66 27.74a14.14 14.14 0 0 1-1.56-.09a.765.765 0 1 1 .17-1.52c2.49.28 4.45-.16 5.84-1.32a6.37 6.37 0 0 0 2.12-4.53a.75.75 0 0 1 .82-.71a.78.78 0 0 1 .72.81A7.89 7.89 0 0 1 14.09 26a8.2 8.2 0 0 1-5.43 1.74z"
              fill="#626262"
            />
          </svg>
        </button>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          v-else
          class="animate-spin"
        >
          <path
            opacity="0.2"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            fill="currentColor"
          />
          <path
            d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
            fill="currentColor"
          />
        </svg>
        <div
          class="tooltip tooltip-bottom text-left"
        >{{ store.dir === "rtl" ? "ثبت ورود/خروج" : "Check in/out" }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useTask } from '../stores/tasks'

export default defineComponent({
  setup() {
    const store = useTask();
    const loading = ref(false)

    const check = async () => {
      loading.value = true;
      await store.check().then(res => {
        store.isCheckedIn = res.data.isCheckIn;
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        loading.value = false;
      })
    }

    return { store, loading, check }
  }
})

</script>