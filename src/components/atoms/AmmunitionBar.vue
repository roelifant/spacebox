<script setup lang="ts">
import { computed, ComputedRef, watch } from "vue";
import GameStateService from "../../game/services/GameStateService";

const ammoClipPercent: ComputedRef = computed(() => {
  const clip = Math.floor(GameStateService.inventory.value.ammo/10)*10;
  const excess = GameStateService.inventory.value.ammo - clip;
  console.log(excess);
  return (excess / 10) * 100;
});
</script>

<template>
    <div
      v-for="clip in Math.ceil(GameStateService.inventory.value.maxAmmo / 10)"
      class="w-full flex-grow flex flex-col justify-end"
      >
        <div
          v-if="clip >= Math.ceil((GameStateService.inventory.value.ammo+1) / 10) && (clip-1) * 10 < GameStateService.inventory.value.ammo"
          class="w-full bg-white"
          :class="['h-['+ammoClipPercent+'%]']"
        />
        <div v-else-if="GameStateService.inventory.value.ammo > (clip*10)-1" class="w-full h-full bg-white" />
        <div v-else class="w-full h-full" />
      </div>
</template>