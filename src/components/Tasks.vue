<template>
  <div class="w-3/4 mx-auto pb-8">
    <Modal v-if="store.showNameModal" ref="modalRef" />
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
              >{{ store.dir === "rtl" ? "ثبت" : "Save" }}</button>
              <button
                type="button"
                @click="cancelHandler"
                class="mx-2 rounded-md bg-red-200 text-red-800 px-2 py-1 hover:(bg-red-300 text-red-900)"
              >{{ store.dir === "rtl" ? "بازگشت" : "Cancel" }}</button>
            </div>
          </div>
        </div>
      </teleport>
      <transition-group name="list-complete" tag="div">
        <TaskItem
          v-for="(task, index) in store.tasks"
          :task="task.task"
          :id="task.task.id"
          :key="index"
          :subtasks="task.subTasks"
          @click="store.selectedTaskIndex = index"
          :class="classNames(index)"
        >
          <template v-slot:default>
            <div
              v-if="!task.task.showSubTaskInput"
              class="text-gray-500 flex text-sm my-4 cursor-pointer"
              @click.stop="clickCreateSubTaskHandler(task.task.id, index)"
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
              <p>{{ store.dir === "rtl" ? "ایجاد تسک" : "Create a subtask" }}</p>
            </div>
            <div v-else>
              <sub-task-input :taskIndex="index" :task-id="task.task.id" />
            </div>
          </template>
        </TaskItem>
      </transition-group>
    </div>
    <div v-else>
      <div v-if="loading">
        <svg
          class="w-10 h-10 animate-spin mx-auto text-gray-500"
          width="24"
          height="24"
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
import { ref, defineComponent, onUnmounted, computed, onMounted, watch } from "vue";
import { useTask } from "../stores/tasks";
import Modal from "./Modal.vue";
import SubTaskInput from "./SubTaskInput.vue";
import TaskItem from "./TaskItem.vue";
import { useTimestamp, useIntervalFn } from '@vueuse/core'

export default defineComponent({
  components: { Modal, TaskItem, SubTaskInput },
  setup() {
    const taskStore = useTask();

    const clickedName = ref("");

    const descriptionValue = ref("");
    const taskDescriptionIndex = ref(-1);
    const descriptionModalText = ref(null);
    const timer = ref(null);
    const modalRef = ref(null);
    const loading = ref(false);
    const timestamp = useTimestamp({ offset: 0 })



    const saveDescriptionHandler = () => {
      taskStore.addDescription(
        descriptionValue.value,
        taskDescriptionIndex.value
      );
      cancelHandler();
    };


    watch(() => taskStore.tickingTask, value => {
      if (value && value.task) {
        resume();
      } else {
        pause();
      }
    })

    const { pause, resume, isActive } = useIntervalFn(() => {
      if (taskStore.tickingTask) {

        const subTask = taskStore.tickingTask.subTasks.find(subTask => subTask.isTicking)
        if (subTask) {
          subTask.totalTime = taskStore.toStringTime(timestamp.value + taskStore.getTaskMilliSeconds(subTask))
        }
        taskStore.tickingTask.task.totalTime = taskStore.toStringTime(timestamp.value + taskStore.getTaskMilliSeconds(taskStore.tickingTask.task))
      }
    }, 900)



    onMounted(async () => {
      loading.value = true;
      await taskStore.getTodayTasks();
      await taskStore.getTasksNames();
      await taskStore.getSubtasksNames();
      loading.value = false;
    });

    onUnmounted(() => {
      window.clearTimeout(timer.value);
    });

    const descriptionModalOpenHandler = (task, index) => {
      taskStore.showDescriptionModal = true;
      descriptionValue.value = task.description.text;
      taskDescriptionIndex.value = index;
      timer.value = setTimeout(() => {
        console.log(descriptionModalText.value);
        descriptionModalText.value.focus();
      }, 100);
    };

    const cancelHandler = () => {
      taskStore.showDescriptionModal = false;
      descriptionValue.value = "";
      taskDescriptionIndex.value = -1;
    };

    const classNames = (index) => {
      let classNames = "";
      const background = index % 2 === 0 ? " bg-gray-50" : " bg-white";
      classNames = classNames + background;
      if (
        taskStore.currentIndex === index &&
        taskStore.tasks[index].isTicking
      ) {
        classNames = classNames + " bg-green-100";
      }
      if (taskStore.selectedTaskIndex === index) {
        const selected = " !ring-2 ring-purple-300";
        classNames = classNames + selected;
      } else {
        const ringColor =
          index % 2 === 0 ? " ring-2 ring-gray-50" : " ring-2 ring-white";
        classNames = classNames + ringColor;
      }
      return classNames;
    };

    const clickCreateSubTaskHandler = (id, index) => {
      const { task } = taskStore.tasks.find((task) => task.task.id === id);
      task.showSubTaskInput = true;
      taskStore.tasks.map((task, idx) => {
        if (idx !== index) {
          task.task.showSubTaskInput = false;
        }
      });
    };

    const createSubTask = async (id) => {
      await tasksApi
        .createTask({ title: taskName.value, parentId: id })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    return {
      store: taskStore,
      descriptionValue,
      saveDescriptionHandler,
      descriptionModalOpenHandler,
      cancelHandler,
      classNames,
      clickedName,
      descriptionModalText,
      modalRef,
      loading,
      createSubTask,
      clickCreateSubTaskHandler,
    };
  },
});
</script>
