import { defineStore } from "pinia";
import tasksApi from "../api/tasksApi";
import { toIsoString } from "../utils/toIsoDate";

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
    userName: "",
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
    totalTime: "00:00:00",
    timer: JSON.parse(window.localStorage.getItem("taskStore"))
      ? JSON.parse(window.localStorage.getItem("taskStore")).timer
      : null,
  }),
  // optional getters
  getters: {
    getTaskNameIndex: (state) => state.aboutToChangeNameTaskIndex,
    isTicking: (state) =>
      state.tasks.some(
        (task) =>
          task.task.isTicking ||
          task.subTasks.some((subTask) => subTask.isTicking)
      ),
    tasksLength: (state) => state.tasks.length,
    isAuthenticated: (state) => !!state.token,
    tickingTask: (state) => state.tasks.find((task) => task.task.isTicking),
  },
  // optional actions
  actions: {
    async getTodayTasks() {
      await tasksApi.getTodayTasks().then((res) => {
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
            sub.totalTime = this.toStringTime(this.getTaskMilliSeconds(sub));
          });
          object.task.totalTime = this.toStringTime(
            this.getSubTasksTime(object) + this.getTaskMilliSeconds(object.task)
          );
        });
        this.tasks = tasks;
        this.calculateTotalTime({value: 0})
      });
    },
    getSubTasksTime(task) {
      let subTimes = 0;
      task.subTasks.map((sub, index) => {
        if (!sub.isTicking) subTimes = subTimes + this.getTaskMilliSeconds(sub);
        else {
          let subTask = JSON.parse(JSON.stringify(sub))
          subTask.date.push({ date: toIsoString(new Date()), isBeginning: false })
          subTimes = subTimes + this.getTaskMilliSeconds(subTask)
        }
      });
      return subTimes;
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
      return tasksApi.getUserInfo().then((res) => {
        this.userName = res.data.name;
        this.isCheckedIn = res.data.isCheckedIn;
      });
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
    async _toggleMainTask(task) {
      task.task.loading = true;
      const error = await tasksApi
        .addTimeToTask(task.task.id)
        .then((res) => {
          if (res.status < 300) {
            task.task.date.push(res.data.date);
            // const tickingSubTask = parentTask.subTasks.find(
            //   (subTask) => subTask.isTicking
            // );
            task.task.isTicking = res.data.date.isBeginning;
            const tickingTask = this.tasks.find(
              (tsk) => tsk.task.id !== task.task.id && tsk.task.isTicking
            );
            if (tickingTask) {
              tickingTask.task.isTicking = false;
            }
          } else {
            return { message: res.data.message, type: "error" };
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          task.task.loading = false;
        });
      if (error) {
        return error;
      }
    },
    async _toggleSubTask(subTask, mainTask) {
      subTask.loading = true;
      const error = await tasksApi
        .addTimeToTask(subTask.id)
        .then((res) => {
          if (res.status < 300) {
            subTask.date.push(res.data.date);
            // const tickingSubTask = parentTask.subTasks.find(
            //   (subTask) => subTask.isTicking
            // );
            subTask.isTicking = res.data.date.isBeginning;
            const tickingSubTask = mainTask.subTasks.find(
              (tsk) => tsk.id !== subTask.id && tsk.isTicking
            );
            if (tickingSubTask) {
              tickingSubTask.isTicking = false;
            }
          } else {
            return { message: res.data.message, type: "error" };
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          subTask.loading = false;
        });
      if (error) {
        return error;
      }
    },
    async toggleTask(id, parentTaskId) {
      let error = null;
      // if there is a parentId populate it with parent task
      if (parentTaskId) {
        const parentTask = this.tasks.find(
          (task) => task.task.id === parentTaskId
        );
        const childTask = parentTask.subTasks.find(
          (subTask) => subTask.id === id
        );
        error = this._toggleSubTask(childTask, parentTask);
      }
      // if there isn't a parentId then populate it with the actual task
      else
        error = this._toggleMainTask(
          this.tasks.find((task) => task.task.id === id)
        );
      if (error) return error;
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
        .catch((err) => console.error(err));
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
    calculateTotalTime(timestamp) {
      let totalTime = 0;
      if (this.tasks) {
        this.tasks.map(
          (task, index) =>
            (totalTime =
              totalTime +
              this.getSubTasksTime(task) +
              this.getTaskMilliSeconds(task.task))
        );
      }
      this.totalTime = this.toStringTime(totalTime + timestamp.value);
    },
    getTaskMilliSeconds(task) {
      let time = 0;
      task.date.map((d) => {
        if (!d.isBeginning) {
          time = time + new Date(d.date).getTime();
        } else {
          time = time - new Date(d.date).getTime();
        }
      });
      return time;
    },
  },
});
