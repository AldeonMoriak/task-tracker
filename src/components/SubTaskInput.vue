<template>
  <div class="relative flex mt-4 mb-24 items-center font-vazir z-10">
    <div class="relative w-full flex flex-col items-center justify-center">
      <div class="max-w-24rem absolute top-0 w-full">
        <div class="flex">
          <input
            type="text"
            ref="taskInput"
            v-model="newTaskName"
            :placeholder="store.dir === 'rtl' ? 'عنوان تسک ثانویه' : 'Enter a subtask...'"
            @focus="focusHandler"
            @blur="isFocused = false"
            class="block resize-none overflow-hidden w-full bg-white focus:outline-none w-full font-vazir font-bold-body-weight flex py-2 px-8 rounded-xl border-2 border-transparent text-gray-900 transition-colors duration-200 placeholder-gray-400 focus:(ring-1 ring-blue-300) disabled:(bg-gray-100 cursor-wait)"
            :disabled="loading"
            @keypress.enter="insertTaskHandler"
          />
          <div
            class="absolute top-0 p-2"
            :class="{ 'left-0': store.dir === 'rtl', 'right-0': store.dir === 'ltr' }"
          >
            <button
              v-show="newTaskName && isFocused && !loading"
              type="button"
              class="focus:outline-none bg-gray-50 border-2 text-green-400 border-white rounded-2xl px-2 py-1 hover:text-green-700"
              @click="insertTaskHandler"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                class="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <div
              v-if="loading"
              class="bg-gray-50 border-2 text-gray-400 border-white rounded-2xl px-2 py-1"
            >
              <svg
                class="w-5 h-5 animate-spin"
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
          </div>
          <button
            type="button"
            class="text-gray-500 p-2 rounded-1 hover:text-gray-700 z-20 absolute right-0"
            @click="store.tasks[taskIndex].task.showSubTaskInput = false"
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
      </div>
      <div
        class="absolute flex justify-center mt-24 w-full max-w-24rem"
        v-if="isFocused && names.length > 0"
      >
        <ul
          class="absolute z-10 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm max-w-24rem mx-auto flex justify-center flex-col"
          tabindex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-option-3"
        >
          <!--
        Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

        Highlighted: "text-white bg-indigo-600", Not Highlighted: "text-gray-900"
          -->
          <li
            class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9"
            id="listbox-option-0"
            role="option"
            v-for="task in names"
            :key="task.id"
            @click="clickNameHandler(task)"
          >
            <div class="flex items-center">
              <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
              <span class="font-normal ml-3 block truncate">{{ task.title }}</span>
            </div>

            <!--
          Checkmark, only display for selected option.

          Highlighted: "text-white", Not Highlighted: "text-indigo-600"
            -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onDeactivated, ref, computed } from 'vue'
import { useTask } from '../stores/tasks'
import tasksApi from '../api/tasksApi'
export default defineComponent({
  props: {
    taskId: {
      type: Number,
      default: -1
    },
    taskIndex: {
      type: Number,
      default: -1
    }
  },
  setup(props) {
    const newTaskName = ref('')
    const store = useTask()
    const keyboardEventListener = ref(null)
    const taskInput = ref(null)
    const loading = ref(false);
    const timer = ref(null)
    const isFocused = ref(false)

    const names = computed(() => store.tasksNames.filter(task => task.title.toLowerCase().includes(newTaskName.value.toLowerCase())))

    const focusHandler = () => {
      isFocused.value = true
    }

    const blurHandler = () => {
      setTimeout(() => {
        // store.isFocused = false;
      }, 100);
    }

    const clickNameHandler = (task) => {
      setTimeout(() => {
        taskInput.value.focus()
        newTaskName.value = task.title
      }, 150);
    }

    onDeactivated(() => {
      window.clearTimeout(keyboardEventListener.value)
    })

    const onClearInput = () => {
      newTaskName.value = ''
      taskInput.value.blur()
    }

    const insertTaskHandler = async () => {
      // store.addTask(newTaskName.value)
      // const candidate = store.tasksNames.find(task => task.task.title === newTaskName.value)
      let id = null;
      // if (candidate) id = candidate.id
      loading.value = true;
      await tasksApi.createTask({ title: newTaskName.value, parentId: props.taskId, id }).then(res => {
        store.getTasksNames();
        store.getTodayTasks();
        console.log(res)
        loading.value = false
        newTaskName.value = "";
        isFocused = false;
      }).catch(err => {
        loading.value = false
      })
    }


    return {
      newTaskName,
      store,
      focusHandler,
      blurHandler,
      insertTaskHandler,
      taskInput,
      onClearInput,
      loading,
      names,
      clickNameHandler,
      isFocused
    }
  },
});
</script>