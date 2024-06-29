<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    background?: boolean;
    show: boolean;
  }>(),
  {
    background: false,
    show: false,
  }
);
</script>

<template>
  <transition>
    <p
      v-show="show"
      :class="{ 'bg-gray-600': background }"
      class="text-gray-400 uppercase px-3 py-1 text-xs font-bold"
    >
      <slot />
    </p>
  </transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>