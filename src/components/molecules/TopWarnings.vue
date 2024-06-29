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
    <transition>
            <div v-show="fuelPercent <= 30">
              <p class="
                    text-red-500 text-center
                    uppercase
                    font-bold
                    text-sm
                    mt-3
                    animate-pulse
                  ">
                <i class="fa-solid fa-triangle-exclamation pr-1" /> low fuel
                <i class="fa-solid fa-triangle-exclamation pl-1" />
              </p>
            </div>
          </transition>
          <transition>
            <div v-show="hullPercent < 50">
              <p class="
                    text-red-500 text-center
                    uppercase
                    font-bold
                    text-sm
                    mt-3
                    animate-pulse
                  ">
                <i class="fa-solid fa-triangle-exclamation pr-1" /> badly damaged
                <i class="fa-solid fa-triangle-exclamation pl-1" />
              </p>
            </div>
          </transition>
</template>