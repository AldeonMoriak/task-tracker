<template>
  <a :href="href" @click.prevent="go">
    <slot></slot>
  </a>
</template>

<script>
import routes from "../routes";
export default {
  props: {
    href: {
      type: String,
      required: true,
    },
  },
  methods: {
    go() {
      this.$root.currentRoute = "/task-tracker/" + this.href;
      window.history.pushState(
        null,
        routes["/task-tracker/" + this.href].name,
        "/task-tracker/" + this.href
      );
    },
  },
};
</script>