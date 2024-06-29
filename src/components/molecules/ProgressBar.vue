<script setup lang="ts">
import GameStateService from "../../game/services/GameStateService";
</script>

<template>
    <div class="flex items-center pr-10 gap-2">
          <p v-if="GameStateService.upgradePercent.value === 100" class="text-yellow-300 text-xs uppercase">Complete</p>
          <p v-else class="text-xs uppercase">progress</p>
          <div class="w-32 border-2 border-white h-2">
            <div
              :class="['w-[' + GameStateService.upgradePercent.value + '%]', { 'bg-yellow-300': GameStateService.upgradePercent.value === 100 }]"
              class="h-full bg-white transition-all" />
          </div>
          <!-- <p class="text-xs">{{GameStateService.upgradePercent?.value}}%</p> -->
        </div>
</template>
