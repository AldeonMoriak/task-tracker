<template>
  <div v-if="tasks && tasks.length > 0" class="mt-4 font-vazir">
    <transition-group name="list-complete" tag="p">
      <div
        v-for="(task, index) in tasks"
        :key="index"
        class="
          flex
          justify-between
          ring
          p-4
          rounded
          mb-4
          cursor-pointer
          list-complete-item
        "
        :class="classNames(index)"
        @click="$emit('task-clicked', index)"
      >
        <span class="">
          {{ task.name }}
        </span>
        <div class="flex">
          <span>{{
            task.hours + ":" + task.minutes + ":" + task.seconds
          }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="
              h-6
              w-6
              p-1
              mx-5
              text-red-600
              bg-red-200
              rounded-full
              hover:(bg-red-300
              text-red-800)
            "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            @click.stop="$emit('delete-clicked', index)"
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
    </transition-group>
  </div>
  <div v-else>
    <div v-if="direction === 'rtl'" class="text-red-600 font-vazir text-xl lg:text-3xl font-bold text-center my-auto">تسکی که میخوای رو اضافه کن!</div>
    <div v-else class="text-red-600 font-semibold text-xl lg:text-3xl text-center my-auto">Add a task!</div>
  </div>
</template>

<script>
export default {
  props: {
    tasks: {
      type: Array,
      default() {
        return [];
      },
    },
    currentIndex: {
      type: Number,
      default: -1,
    },
    isTicking: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: 'rtl'
    }
  },
  methods: {
    classNames(index) {
      let classNames = "";
      const background =
        index % 2 === 0
          ? " bg-blue-100 ring-blue-200"
          : " bg-pink-100 ring-pink-200";
      classNames = classNames + background;
      if (this.currentIndex === index && this.isTicking) {
        classNames = classNames + " ring-red-500";
      }
      return classNames;
    },
  },
};
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
  position: absolute;
}
</style>