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
        <TaskItem
          v-for="(task, index) in store.tasks"
          :index="index"
          :task="task.task"
          :id="index"
          :key="index"
          :subtasks="task.subTasks"
          @click="store.selectedTaskIndex = index"
          :class="classNames(index)"
        >
          <template v-slot:default>
            <div
              class="text-gray-500 flex text-sm my-4 cursor-pointer"
              @click.stop="createSubTask(task.task.id)"
            >
              <div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  class="w-5 h-5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <p>{{ store.dir === 'rtl' ? 'ایجاد تسک' : 'Create a subtask' }}</p>
            </div>
          </template>
        </TaskItem>
      </transition-group>
    </div>
    <div v-else>
      <div v-if="loading">
        <svg
          width="24"
          height="24"
          class="w-10 h-10 animate-spin mx-auto text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.2"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            fill="currentColor"
          />
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12H19C19 15.866 15.866 19 12 19V22Z"
            fill="currentColor"
          />
          <path
            d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
            fill="currentColor"
          />
        </svg>
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
  </div>
</template>

<script>
import { ref, defineComponent, onUnmounted, computed, onMounted } from 'vue'
import { useTask } from '../stores/tasks'
import Modal from './Modal.vue'
import TaskItem from './TaskItem.vue'

export default defineComponent({
  components: { Modal, TaskItem },
  setup() {
    const taskStore = useTask()

    const clickedName = ref('')

    const descriptionValue = ref('')
    const taskDescriptionIndex = ref(-1)
    const descriptionModalText = ref(null)
    const timer = ref(null)
    const modalRef = ref(null)
    const loading = ref(false);

    const saveDescriptionHandler = () => {
      taskStore.addDescription(descriptionValue.value, taskDescriptionIndex.value)
      cancelHandler()
    }

    onMounted(async () => {
      loading.value = true;
      await taskStore.getTodayTasks();
      await taskStore.getTasksNames();
      loading.value = false
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
      descriptionModalText,
      modalRef,
      loading
    }
  }
})
</script>
