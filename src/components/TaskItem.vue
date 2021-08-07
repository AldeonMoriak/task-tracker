<template>
  <div class="flex flex-col p-4 rounded mb-4 list-complete-item shadow-md">
    <div class="flex justify-between">
      <div class="flex">
        <span class @click.stop="nameModalHandler(task)">{{ task.title }}</span>
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
        <div v-if="!task.loading">
          <svg
            v-if="!task.isTicking"
            aria-label="play button"
            class="h-6 w-6 mx-5 text-green-600 bg-green-200 rounded-full hover:(bg-green-300 text-green-800) cursor-pointer transition ease-in duration-300"
            viewBox="0 0 24 24"
            fill="none"
            @click="toggleTaskHandler"
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
            @click="toggleTaskHandler"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 7H8V17H11V7Z" fill="currentColor" />
            <path d="M13 17H16V7H13V17Z" fill="currentColor" />
          </svg>
        </div>
        <div v-else>
          <svg
            width="24"
            height="24"
            class="animate-spin h-6 w-6 mx-5 text-gray-600 bg-gray-200 rounded-full hover:(bg-green-300 text-green-800) cursor-pointer transition ease-in duration-300"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 p-1 text-red-600 bg-red-200 rounded-full hover:(bg-red-300 text-red-800) cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          @click.stop="store.deleteTask(id)"
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
      @click.stop="descriptionModalOpenHandler(task, id)"
    >{{ store.descriptionText(task) }}</div>
    <slot></slot>
    <div v-for="subtask in subtasks" :key="subtask.id">
      <TaskItemComponent class="bg-gray-100" :task="subtask" :id="task.id"></TaskItemComponent>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'
import { useTask } from '../stores/tasks'
import tasksApi from '../api/tasksApi'

export default defineComponent({
  name: 'TaskItemComponent',
  props: {
    task: {
      type: Object,
      default: () => null
    },
    id: {
      type: Number,
      default: -1
    },
    subtasks: {
      type: Array,
      default: () => []
    },
  },
  setup(props) {
    console.log(props.subtasks)
    const store = useTask();
    const classObject = computed(() => {
      return {
        'text-right': store.dir === 'rtl',
        'text-left': store.dir !== 'rtl'
      }
    });
    
    const toggleTaskHandler = () => {
      if (props.id === props.task.id) {
        store.toggleTask(props.task.id, false);
      } else {
        store.toggleTask(props.task.id, props.id);
      }
    }

    const nameModalHandler = (task) => {
      taskStore.showNameModal = true
      clickedName.value = task.title
      setTimeout(() => {
        modalRef.value.focusHandler()
      }, 100);
    }


    const taskName = ref('');

    return {
      store,
      classObject,
      taskName,
      nameModalHandler,
      toggleTaskHandler
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