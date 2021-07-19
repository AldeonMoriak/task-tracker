<template>
  <div class="w-3/4 mx-auto pb-8">
    <Modal v-if="store.showNameModal" :name="clickedName" ref="modalRef" />
    <div v-if="store.tasks && store.tasks.length > 0" class="mt-4 font-vazir">
      <teleport to="body">
        <div
          v-if="store.showDescriptionModal"
          :dir="store.dir"
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <div
          v-if="store.showDescriptionModal"
          class="modal font-vazir absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center"
        >
          <div
            class="flex flex-col items-center justify-center p-5 w-72 h-72 rounded-md bg-white min-w-max max-w-md h-1/3"
          >
            <textarea
              :dir="store.dir"
              ref="descriptionModalText"
              v-model="descriptionValue"
              class="p-2 my-2 rounded-md bg-gray-200 w-full h-full"
              @keydown.shift.enter="saveDescriptionHandler"
            />
            <div class="flex">
              <button
                type="button"
                @click="saveDescriptionHandler"
                class="rounded-md bg-green-200 text-green-800 px-2 py-1 hover:(bg-green-300 text-green-900)"
              >{{ store.dir === 'rtl' ? 'ثبت' : 'Save' }}</button>
              <button
                type="button"
                @click="cancelHandler"
                class="mx-2 rounded-md bg-red-200 text-red-800 px-2 py-1 hover:(bg-red-300 text-red-900)"
              >{{ store.dir === 'rtl' ? 'بازگشت' : 'Cancel' }}</button>
            </div>
          </div>
        </div>
      </teleport>
      <transition-group name="list-complete" tag="div">
        <div
          v-for="(task, index) in store.tasks"
          :id="index"
          :key="index"
          @click="store.selectedTaskIndex = index"
          class="flex flex-col p-4 rounded mb-4 list-complete-item shadow-md"
          :class="classNames(index)"
        >
          <div class="flex justify-between">
            <div class="flex">
              <span class @click.stop="nameModalHandler(task.name, index)">{{ task.name }}</span>
              <svg
                v-if="!task.description.isShown"
                id="chevron-down"
                class="mx-2 text-blue-700 hover:(bg-blue-200 ) rounded-md w-5 h-5 cursor-pointer transition ease-in-out duration-200"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                @click.stop="task.description.isShown = true"
              >
                <path
                  d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z"
                  fill="currentColor"
                />
              </svg>
              <svg
                v-else
                id="chevron-up"
                class="mx-2 text-blue-700 hover:(bg-blue-200) rounded-md w-5 h-5 cursor-pointer transition ease-in-out duration-200"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                @click.stop="task.description.isShown = false"
              >
                <path
                  d="M17.6569 16.2427L19.0711 14.8285L12.0001 7.75739L4.92896 14.8285L6.34317 16.2427L12.0001 10.5858L17.6569 16.2427Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div class="flex">
              <span>
                {{
                  task.totalTime
                }}
              </span>
              <div class="flex justify-between">
                <svg
                  v-if="!task.isTicking"
                  aria-label="play button"
                  class="h-6 w-6 mx-5 text-green-600 bg-green-200 rounded-full hover:(bg-green-300 text-green-800) cursor-pointer transition ease-in duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  @click="store.toggleTask(index, 'start')"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="currentColor" />
                </svg>
                <svg
                  v-else
                  aria-label="pause button"
                  class="transition ease-in-out duration-500 h-6 w-6 mx-5 text-pink-600 bg-pink-200 rounded-full hover:(bg-pink-300 text-pink-800) cursor-pointer"
                  viewBox="0 0 24 24"
                  fill="none"
                  @click="store.toggleTask(index, 'stop')"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11 7H8V17H11V7Z" fill="currentColor" />
                  <path d="M13 17H16V7H13V17Z" fill="currentColor" />
                </svg>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 p-1 text-red-600 bg-red-200 rounded-full hover:(bg-red-300 text-red-800) cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                @click.stop="store.deleteTask(index)"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
          </div>
          <div
            v-bind:class="classObject"
            class="bg-gray-100 my-2 rounded-md p-2 transition ease-in-out duration-500 cursor-pointer text-gray-500 whitespace-pre-line"
            v-if="task.description.isShown"
            @click.stop="descriptionModalOpenHandler(task, index)"
          >{{ store.descriptionText(task) }}</div>
        </div>
      </transition-group>
    </div>
    <div v-else>
      <div
        v-if="store.dir === 'rtl'"
        class="text-gray-500 font-vazir text-xl lg:text-3xl font-bold text-center my-5"
      >تسکی که میخوای رو اضافه کن!</div>
      <div
        v-else
        class="text-gray-500 font-semibold text-xl lg:text-3xl text-center my-5"
      >Add a task!</div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, onUnmounted, computed, onMounted } from 'vue'
import { useTask } from '../stores/tasks'
import Modal from './Modal.vue'

export default defineComponent({
  components: { Modal },
  setup() {
    const taskStore = useTask()

    const clickedName = ref('')
    const classObject = computed(() => {
      return {
        'text-right': taskStore.dir === 'rtl',
        'text-left': taskStore.dir !== 'rtl'
      }
    })


    const descriptionValue = ref('')
    const taskDescriptionIndex = ref(-1)
    const descriptionModalText = ref(null)
    const timer = ref(null)
    const modalRef = ref(null)

    const saveDescriptionHandler = () => {
      taskStore.addDescription(descriptionValue.value, taskDescriptionIndex.value)
      cancelHandler()
    }

    onMounted(async () => {
      await taskStore.getTodayTasks();
    })

    onUnmounted(() => {
      window.clearTimeout(timer.value)
    })

    const descriptionModalOpenHandler = (task, index) => {
      taskStore.showDescriptionModal = true
      descriptionValue.value = task.description.text
      taskDescriptionIndex.value = index
      timer.value = setTimeout(() => {
        console.log(descriptionModalText.value)
        descriptionModalText.value.focus()
      }, 100)
    }

    const cancelHandler = () => {
      taskStore.showDescriptionModal = false
      descriptionValue.value = ''
      taskDescriptionIndex.value = -1
    }

    const classNames = (index) => {
      let classNames = "";
      const background = index % 2 === 0
        ? " bg-gray-50"
        : " bg-white";
      classNames = classNames + background;
      if (taskStore.currentIndex === index && taskStore.tasks[index].isTicking) {
        classNames = classNames + " bg-green-100";
      }
      if (taskStore.selectedTaskIndex === index) {
        const selected = " !ring-2 ring-purple-300";
        classNames = classNames + selected;
      } else {
        const ringColor = index % 2 === 0 ? " ring-2 ring-gray-50" : " ring-2 ring-white";
        classNames = classNames + ringColor;
      }
      return classNames;
    }

    const nameModalHandler = (name, index) => {
      taskStore.showNameModal = true
      taskStore.aboutToChangeNameTaskIndex = index
      clickedName.value = name
      setTimeout(() => {
        modalRef.value.focusHandler()
      }, 100);
    }

    return {
      store: taskStore,
      descriptionValue,
      saveDescriptionHandler,
      descriptionModalOpenHandler,
      cancelHandler,
      classNames,
      nameModalHandler,
      clickedName,
      classObject,
      descriptionModalText,
      modalRef
    }
  }
})
</script>


<style scoped>
.list-complete-item {
  transition: all 0.8s ease;
}

.list-complete-enter-from,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-complete-leave-active {
  position: relative;
}
</style>