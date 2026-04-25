<script setup>
import { defineAsyncComponent } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: false,
    default: "icons",
  },
  classes: {
    type: String,
    required: false,
  },
});

const icon = defineAsyncComponent(() => {
  return import(
    `@/assets/images/${props.name}.svg`
  );
});
</script>

<template>
  <component :is="icon" :class="classes" />
</template>
