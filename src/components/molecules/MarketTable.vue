<script setup lang="ts">
import { computed, ComputedRef, Ref, ref, watch } from "vue";
import GameStateService from "../../game/services/GameStateService";
import { Cargo } from '../../game/enums/Cargo';

const marketHigh: ComputedRef<Cargo> = computed(() => GameStateService.marketHigh.value);
const marketLow: ComputedRef<Cargo> = computed(() => GameStateService.marketLow.value);
const marketHighAnimation: Ref<boolean> = ref(false);
const marketLowAnimation: Ref<boolean> = ref(false);

watch(() => marketHigh.value, () => {
  marketHighAnimation.value = true;
  setTimeout(() => marketHighAnimation.value = false, 1000);
});

watch(() => marketLow.value, () => {
  marketLowAnimation.value = true;
  setTimeout(() => marketLowAnimation.value = false, 1000);
});
</script>

<template>
    <div class="grid grid-cols-[45px_auto] pt-1">
          <p :class="{ 'flash-animation': marketHighAnimation }"
            class="text-xs border-2 border-white p-1 border-r-0 bg-gray-300 text-black font-bold uppercase text-center">
            high</p>
          <p class="text-xs border-2 border-white p-1 px-2 uppercase transition-all" :class="'bg-cargo-' + marketHigh">
            <span class="block" :class="{ 'pop-animation': marketHighAnimation }">
              {{ marketHigh }}
            </span>
          </p>
          <p :class="{ 'flash-animation': marketLowAnimation }"
            class="text-xs border-2 border-white p-1 border-r-0 border-t-0 bg-gray-500 text-black font-bold uppercase text-center">
            Low</p>
          <p class="text-xs border-2 border-white p-1 px-2 border-t-0 uppercase transition-all"
            :class="'bg-cargo-' + marketLow">
            <span class="block" :class="{ 'pop-animation': marketLowAnimation }">
              {{ marketLow }}
            </span>
          </p>
        </div>
</template>