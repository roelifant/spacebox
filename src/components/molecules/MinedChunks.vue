<script setup lang="ts">
import { watch } from "vue";
import GameStateService from "../../game/services/GameStateService";

watch(
  () => GameStateService.minedMatter.value,
  () => {
    if (GameStateService.minedMatter.value === 0) {
      GameStateService.gainedMatter.value = true;
      setTimeout(() => (GameStateService.gainedMatter.value = false), 1000);
    }
    GameStateService.gainedMatterChunk.value = true;
    setTimeout(() => GameStateService.gainedMatterChunk.value = false, 1500);
  }
);

watch(
  () => GameStateService.minedWater.value,
  () => {
    if (GameStateService.minedWater.value === 0) {
      GameStateService.gainedWater.value = true;
      setTimeout(() => (GameStateService.gainedWater.value = false), 1000);
    }
    GameStateService.gainedWaterChunk.value = true;
    setTimeout(() => GameStateService.gainedWaterChunk.value = false, 1500);
  }
);

watch(
  () => GameStateService.minedMinerals.value,
  () => {
    if (GameStateService.minedMinerals.value === 0) {
      GameStateService.gainedMinerals.value = true;
      setTimeout(() => (GameStateService.gainedMinerals.value = false), 1000);
    }
    GameStateService.gainedMineralsChunk.value = true;
    setTimeout(() => GameStateService.gainedMineralsChunk.value = false, 1500);
  }
);
</script>

<template>
<div class="flex gap-2">
    <div class="py-1 px-2 w-fit bg-cargo-matter font-bold text-sm" :class="{ 'jump-animation': !!GameStateService.gainedMatterChunk.value }">
        {{ GameStateService.minedMatter.value }}/{{ GameStateService.minedMatterLimit.value }}
    </div>
    <div v-show="GameStateService.hasUpgrade('ice_mining')" class="py-1 px-2 w-fit bg-cargo-water font-bold text-sm" :class="{ 'jump-animation': !!GameStateService.gainedWaterChunk.value }">
        {{ GameStateService.minedWater.value }}/{{ GameStateService.minedWaterLimit.value }}
    </div>
    <div v-show="GameStateService.hasUpgrade('mineral_mining')" class="py-1 px-2 w-fit bg-cargo-minerals font-bold text-sm" :class="{ 'jump-animation': !!GameStateService.gainedMineralsChunk.value }">
        {{ GameStateService.minedMinerals.value }}/{{ GameStateService.minedMineralsLimit.value }}
    </div>
</div>
</template>