<script setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { useTask } from '../stores/tasks'

const store = useTask()
const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()
const close = async () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="fixed bottom-0 m-8 p-10 border border-blue-300 rounded z-10 shadow bg-white font-vazir"
    :class="{ 'text-left': store.dir === 'ltr', 'text-right': store.dir === 'rtl' }"
    role="alert"
  >
    <div class="mb-4">
      <span
        v-if="offlineReady"
      >{{ store.dir === 'ltr' ? 'App ready to work offline' : 'برنامه آماده آفلاین کار کردن' }}</span>
      <span
        v-else
      >{{ store.dir === 'ltr' ? 'New content available, click on reload button to update.' : 'اطلاعات جدید موجوده. دکمه رفرش رو بزن.' }}</span>
    </div>
    <button
      class="bg-blue-50 text-blue-600 rounded hover:(text-blue-800 bg-blue-100) outline-none py-1 px-3"
      v-if="needRefresh"
      @click="updateServiceWorker()"
    >{{ store.dir === 'ltr' ? 'Reload' : 'رفرش' }}</button>
    <button
      class="bg-red-50 text-red-600 rounded hover:(text-red-800 bg-red-100) outline-none py-1 px-3 mx-2"
      @click="close"
    >{{ store.dir === 'ltr' ? 'Close' : 'بستن' }}</button>
  </div>
</template>