import { defineStore } from 'pinia'

export const useTask = defineStore({
    // name of the store
    // it is used in devtools and allows restoring state
    id: 'tasksStore',
    // a function that returns a fresh state
    state: () => ({
        tasks: JSON.parse(window.localStorage.getItem("tasks")) ?? [],
        dir: "rtl",
        currentIndex: -1,
        isFocused: false,
        showNameModal: false,
        showDescriptionModal: false,
        whichKeyIsPressed: "",
        selectedTaskIndex: -1,
        aboutToChangeNameTaskIndex: -1,
    }),
    // optional getters
    getters: {
        getTaskNameIndex: state => state.aboutToChangeNameTaskIndex,
        totalTime(state) {
            let totalTime = 0;
            if (state.tasks)
                state.tasks.map(
                    (task, index) =>
                        totalTime = totalTime + this.taskTotalTime(index)
                )
            return state.toStringTime(totalTime)
        },
        isTicking: (state) => state.tasks.some(task => task.isTicking)
    },
    // optional actions
    actions: {
        addTask(value) {
            if (!value || value.length < 1) {
                return;
            }
            this.tasks.push({
                name: value,
                dates: [],
                description: {
                    isShown: false,
                    text: ''
                },
                isTicking: false
            });
        },
        addDescription(value, index) {
            this.task[index].description.text = value
        },
        toggleTask(index, type) {
            if (type === 'start') {
                this.tasks[index].dates.push({ start: Date.now() });
                if (this.currentIndex !== index && this.currentIndex !== -1) {
                    const dateIndex = this.tasks[this.currentIndex].dates.length - 1
                    this.tasks[this.currentIndex].dates[dateIndex].end = Date.now();
                }
            } else {
                const dateIndex = this.tasks[index].dates.length - 1
                this.tasks[index].dates[dateIndex].end = Date.now();
            }
            this.changeCurrentIndex(index);
        },
        changeCurrentIndex(index) {
            this.currentIndex = index;
        },
        toStringTime(totalTime) {
            return (
                Math.floor(totalTime / 3600).toLocaleString(undefined, {
                    minimumIntegerDigits: 2,
                }) +
                ":" +
                Math.floor((totalTime % 3600) / 60).toLocaleString(undefined, {
                    minimumIntegerDigits: 2,
                }) +
                ":" +
                ((totalTime % 3600) % 60).toLocaleString(undefined, {
                    minimumIntegerDigits: 2,
                })
            )
        },
        taskTotalTime(index) {
            let total = 0;
            this.tasks[index].dates.map(date => {
                if (date.end) {
                    total = total + date.end - date.start
                } else {
                    total = total + Date.now() - date.start
                }
            });
            return total
        },
        changeTaskName(value, index) {
            this.tasks[index].name = value
        }
    },
})