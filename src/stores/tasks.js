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
          object.task.description = {
            isShown: false,
            text: object.task.description,
          };
          object.task.totalTime = "00:00:00";
          object.task.showSubTaskInput = false;
          object.subTasks.map((sub, index) => {
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
        this.userName  = res.data.name;
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
      // if (type === "start") {
      //   const tickingIndex = this.tasks.findIndex((el) => el.isTicking);
      //   this.tasks[index].date.push({ start: Date.now() });
      //   this.tasks[index].isTicking = true;
      //   this.counter(index);
      //   if (tickingIndex !== -1) {
      //     const dateIndex = this.tasks[tickingIndex].date.length - 1;
      //     this.tasks[tickingIndex].date[dateIndex].end = Date.now();
      //     this.tasks[tickingIndex].isTicking = false;
      //   }
      // } else {
      //   this.tasks[index].isTicking = false;
      //   const dateIndex = this.tasks[index].date.length - 1;
      //   this.tasks[index].date[dateIndex].end = Date.now();
      // }
      // this.changeCurrentIndex(index);
      await tasksApi.addTimeToTask(id).then((res) => {
        if (parentTaskId) {
          const { task, subTasks } = this.tasks.map((task) => {
            task.task.id === parentTaskId;
          });
          debugger;
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
