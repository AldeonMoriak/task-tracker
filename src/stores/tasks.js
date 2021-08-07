import { defineStore } from "pinia";
import tasksApi from "../api/tasksApi";

export const useTask = defineStore({
  // name of the store
  // it is used in devtools and allows restoring state
  id: "tasksStore",
  // a function that returns a fresh state
  state: () => ({
    showTotalTime: true,
    token: window.localStorage.getItem("access_token"),
    tasksNames: [],
    subtasksNames: [],
    tasks: [],
    isCheckedIn: false,
    userName: '',
    dir: JSON.parse(window.localStorage.getItem("taskStore"))
      ? JSON.parse(window.localStorage.getItem("taskStore")).dir
      : "rtl",
    currentIndex: JSON.parse(window.localStorage.getItem("taskStore"))
      ? JSON.parse(window.localStorage.getItem("taskStore")).currentIndex
      : -1,
    isFocused: JSON.parse(window.localStorage.getItem("taskStore"))
      ? JSON.parse(window.localStorage.getItem("taskStore")).isFocused
      : false,
    showNameModal: JSON.parse(window.localStorage.getItem("taskStore"))
      ? JSON.parse(window.localStorage.getItem("taskStore")).showNameModal
      : false,
    showDescriptionModal: JSON.parse(window.localStorage.getItem("taskStore"))
      ? JSON.parse(window.localStorage.getItem("taskStore"))
        .showDescriptionModal
      : false,
    whichKeyIsPressed: JSON.parse(window.localStorage.getItem("taskStore"))
      ? JSON.parse(window.localStorage.getItem("taskStore")).whichKeyIsPressed
      : "",
    selectedTaskIndex: JSON.parse(window.localStorage.getItem("taskStore"))
      ? JSON.parse(window.localStorage.getItem("taskStore")).selectedTaskIndex
      : -1,
    aboutToChangeNameTaskIndex: JSON.parse(
      window.localStorage.getItem("taskStore")
    )
      ? JSON.parse(window.localStorage.getItem("taskStore"))
        .aboutToChangeNameTaskIndex
      : -1,
    totalTime: JSON.parse(window.localStorage.getItem("taskStore"))
      ? JSON.parse(window.localStorage.getItem("taskStore")).totalTime
      : "00:00:00",
    timer: JSON.parse(window.localStorage.getItem("taskStore"))
      ? JSON.parse(window.localStorage.getItem("taskStore")).timer
      : null,
  }),
  // optional getters
  getters: {
    getTaskNameIndex: (state) => state.aboutToChangeNameTaskIndex,
    isTicking: (state) => state.tasks.some((task) => task.isTicking),
    tasksLength: (state) => state.tasks.length,
    isAuthenticated: (state) => !!state.token,
  },
  // optional actions
  actions: {
    async getTodayTasks() {
      await tasksApi.getTodayTasks().then((res) => {
        console.log(res);
        let tasks = JSON.parse(JSON.stringify(res.data));
        tasks.map((object, index) => {
          object.task.loading = false;
          object.task.description = {
            isShown: false,
            text: object.task.description,
          };
          object.task.totalTime = "00:00:00";
          object.task.showSubTaskInput = false;
          object.subTasks.map((sub, index) => {
            sub.loading = false;
            sub.description = {
              isShown: false,
              text: sub.description,
            };
            sub.totalTime = "00:00:00";
          });
        });
        this.tasks = tasks;
      });
    },
    async getTasksNames() {
      await tasksApi.getTasksNames().then((res) => {
        this.tasksNames = res.data;
      });
    },
    async getSubtasksNames() {
      await tasksApi.getSubtasksNames().then((res) => {
        this.subtasksNames = res.data;
      });
    },
    async check() {
      return tasksApi.check();
    },
    async getUserInfo() {
      return tasksApi.getUserInfo().then(res => {
        this.userName = res.data.name;
        this.isCheckedIn = res.data.isCheckedIn
      })
    },
    addTask(value) {
      if (!value.trim() || value.trim().length < 1) {
        return;
      }
      this.tasks.push({
        name: value.trim(),
        date: [],
        description: {
          isShown: false,
          text: "",
        },
        isTicking: false,
        totalTime: "00:00:00",
      });
    },
    addDescription(value, index) {
      this.tasks[index].description.text = value;
    },
    async toggleTask(id, parentTaskId) {
      let parentTask = null;
      let childTask = null;
      if (parentTaskId) parentTask = this.tasks.find(task => task.task.id === parentTaskId)
      else parentTask = this.tasks.find(task => task.task.id === id);
      if (parentTaskId) {
        childTask = parentTask.subTasks.find(subTask => subTask.id === id);
        childTask.loading = true;
      }
      parentTask.task.loading = true;
      await tasksApi.addTimeToTask(id).then((res) => {
        parentTask.task.loading = false;
        if (parentTaskId) {
          const tickingSubTask = parentTask.subTasks.find((subTask) => subTask.id !== id && subTask.isTicking);
          // if there is a task and a ticking subtask just change the ticking state of subtask
          childTask.isTicking = !childTask.isTicking
          if (tickingSubTask) {
            tickingSubTask.loading = true;
            tasksApi.addTimeToTask(tickingSubTask.id).then(res => {
              tickingSubTask.loading = false;
              tickingSubTask.isTicking = !tickingSubTask.isTicking
              childTask.loading = false;
            });
          } else if(parentTask.task.isTicking) {
            childTask.loading = false;
            parentTask.task.loading = false;
          } else {
            childTask.loading = false;
            parentTask.task.isTicking = !parentTask.task.isTicking;
            parentTask.task.loading = false;
            //parentTask.task.loading = !parentTask.task.loading
          }
        } else {
          const tickingSubTask = parentTask.subTasks.find(subTask => subTask.isTicking);
          debugger
          if (tickingSubTask) {
            this.toggleTask(tickingSubTask.id, parentTask.task.id)
          } else {
            parentTask.task.isTicking = !parentTask.task.isTicking
            parentTask.task.loading = false;
          }
        }
      });
    },
    counter(index) {
      this.timer = setInterval(() => {
        if (index !== -1) {
          this.tickingTime(index);
          this.calculateTotalTime();
        }
      }, 100);
    },
    changeCurrentIndex(index) {
      this.currentIndex = index;
    },
    toStringTime(time) {
      const seconds = time / 1000;
      return (
        Math.floor(seconds / 3600).toLocaleString(undefined, {
          minimumIntegerDigits: 2,
        }) +
        ":" +
        Math.floor((seconds % 3600) / 60).toLocaleString(undefined, {
          minimumIntegerDigits: 2,
        }) +
        ":" +
        (Math.floor(seconds % 3600) % 60).toLocaleString(undefined, {
          minimumIntegerDigits: 2,
        })
      );
    },
    taskTotalTime(index) {
      let total = 0;
      this.tasks[index].date.map((date) => {
        if (date.end) {
          total = total + date.end - date.start;
        } else {
          total = total + Date.now() - date.start;
        }
      });
      return total;
    },
    async renameTask(title, id) {
      await tasksApi
        .renameTask(title, id)
        .then((res) => {
          this.tasks[this.getTaskNameIndex].task.title = title;
          this.showNameModal = false;
          this.aboutToChangeNameTaskIndex = -1;
        })
        .catch((err) => console.log(err));
    },
    descriptionText(task) {
      if (task.description.text) {
        return task.description.text;
      } else {
        return this.dir === "rtl" ? "توضیحات..." : "Description...";
      }
    },
    deleteTask(index) {
      if (this.currentIndex > index) {
        this.currentIndex--;
      }
      clearInterval(this.timer);
      this.timer = null;
      this.tasks.splice(index, 1);
      if (this.tasks.length < 1) {
        this.calculateTotalTime();
      }
    },
    tickingTime(index) {
      this.tasks[index].totalTime = this.toStringTime(
        this.taskTotalTime(index)
      );
    },
    calculateTotalTime() {
      let totalTime = 0;
      if (this.tasks)
        this.tasks.map(
          (task, index) => (totalTime = totalTime + this.taskTotalTime(index))
        );
      this.totalTime = this.toStringTime(totalTime);
    },
  },
});
