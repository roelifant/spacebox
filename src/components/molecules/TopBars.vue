<script setup lang="ts">
import { computed } from "vue";
import GameStateService from "../../game/services/GameStateService";

const fuelPercent = computed(() => {
  if (GameStateService.inventory.value.fuel < 0) return 0;
  else
    return Math.floor(
      (GameStateService.inventory.value.fuel /
        GameStateService.inventory.value.maxFuel) *
      100
    );
});

const hullPercent: ComputedRef = computed(() => {
  if (GameStateService.inventory.value.hull < 0) return 0;
  else
    return Math.floor(
      (GameStateService.inventory.value.hull /
        GameStateService.inventory.value.maxHull) *
      100
    );
});
</script>

<template>
    <div class="w-full border-2 border-white h-4 p-0.5">
          <div class="bg-orange-300 h-full transition-all" :class="'w-[' + fuelPercent + '%]'" />
        </div>
        <div class="w-full border-2 border-white h-4 p-0.5 relative healthbar-container-clip mt-1">
          <div class="w-full h-full relative healthbar-clip">
            <div class="bg-green-400 h-2 transition-all absolute z-10" :class="'w-[' + hullPercent + '%]'" />
            <div class="bg-red-500 h-2 transition-all delay-150 duration-700 absolute" :class="'w-[' + hullPercent + '%]'" />
          </div>
        </div>
</template>