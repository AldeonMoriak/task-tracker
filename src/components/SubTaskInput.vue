<template>
  <div ref="target" class="relative flex mt-4 mb-24 items-center font-vazir z-10">
    <div class="relative w-full">
      <div class="relative w-full flex flex-col items-center justify-center">
        <div class="max-w-24rem absolute top-0 w-full">
          <div class="flex">
            <input
              type="text"
              ref="taskInput"
              v-model="newTaskName"
              :placeholder="store.dir === 'rtl' ? 'عنوان تسک ثانویه' : 'Enter a subtask...'"
              @focus="focusHandler"
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
          </div>
        </div>
      </div>
      <div class="max-w-24rem mx-auto">
        <div
          class="absolute w-full max-w-24rem mx-auto max-h-64 overflow-y-auto bg-white shadow-lg rounded-md py-1 ring-1 ring-black ring-opacity-5 focus:outline-none mt-12"
          v-if="isFocused && names.length > 0"
        >
          <ul
            class="w-full text-base sm:text-sm flex justify-center flex-col"
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
              class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:(text-indigo-900 bg-indigo-200)"
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
  </div>
</template>
<script>
import { defineComponent, onDeactivated, ref, computed } from 'vue'
import { useTask } from '../stores/tasks'
import tasksApi from '../api/tasksApi'
import { onClickOutside } from '@vueuse/core'
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
    let isFocused = ref(false)
    const target = ref(null)

    onClickOutside(target, () => store.tasks[props.taskIndex].task.showSubTaskInput = false)

    const names = computed(() => store.subtasksNames.filter(task => task.parent.id === props.taskId && task.title.toLowerCase().includes(newTaskName.value.toLowerCase())))

    const focusHandler = () => {
      isFocused.value = true
    }

    const blurHandler = () => {
      setTimeout(() => {
        isFocused.value = false;
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
        store.getSubtasksNames();
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
      isFocused,
      target
    }
  },
});
</script>