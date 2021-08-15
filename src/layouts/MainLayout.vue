<template>
  <div
    :dir="store.dir"
    :class="[store.tasks.length < 5 ? 'h-screen' : 'h-full', 'mx-auto max-w-screen-md text-center border-t-4 border-blue-300 bg-blue-50']"
  >
    <Header />
    <TotalTime />

    <slot></slot>
    <ReloadPrompt />
    <BottomIcons />
  </div>
  <div :dir="store.dir === 'rtl' ? 'ltr' : 'rtl'" class="mx-auto max-w-screen-md text-center">
    <CheckButton />
  </div>
</template>

<script>
import BottomIcons from "../components/BottomIcons.vue";
import CheckButton from "../components/CheckButton.vue";
import ReloadPrompt from "../components/ReloadPrompt.vue";
import TotalTime from "../components/TotalTime.vue";
import Header from "../components/Header.vue";
import { defineComponent, watch, onMounted, ref, onDeactivated } from "vue";
import { useTask } from "../stores/tasks";
export default defineComponent({
  components: {
    BottomIcons,
    ReloadPrompt,
    TotalTime,
    CheckButton,
    Header
  },
  setup() {
    const store = useTask();
    const keyboardEventListener = ref(null);
    const tasksRef = ref(null);
    let timer = null;

    onDeactivated(() => window.clearTimeout(timer));

    function bottomIconHandler(event) {
      store.whichKeyIsPressed = event.code.toLowerCase();
      timer = setTimeout(() => {
        store.whichKeyIsPressed = "";
      }, 100);
    }

    onMounted(async () => {
      await store.getUserInfo();
      // keyboardEventListener.value = addEventListener(
      //   "keydown",
      //   keyListenerHandler
      // );
      if (store.isTicking)
        store.counter(store.tasks.findIndex((task) => task.isTicking));
    });

    watch(
      () => store.$state,
      (state) => {
        // persist the whole state to the local storage whenever it changes
        localStorage.setItem("taskStore", JSON.stringify(state));
      },
      { deep: true }
    );
    return { store, tasksRef };
  }
})
</script>