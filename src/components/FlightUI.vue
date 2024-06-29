<script setup lang="ts">
import { Manager } from "../game/Manager";
import { computed, ComputedRef, Ref, ref, watch } from "vue";
import GameStateService from "../game/services/GameStateService";
import "vue3-circle-progress/dist/circle-progress.css";
import CircleProgress from "vue3-circle-progress";
import PlanetUIService from '../game/services/PlanetUIService';
import Market from '../game/services/Market';
import { Cargo } from '../game/enums/Cargo';
import gsap from 'gsap';
import MarketTable from "./molecules/MarketTable.vue";
import Heading from "./molecules/Heading.vue";
import TopBars from "./molecules/TopBars.vue";
import TopWarnings from "./molecules/TopWarnings.vue";
import ProgressBar from "./molecules/ProgressBar.vue";
import MoneyCounter from "./atoms/MoneyCounter.vue";
import AmmunitionBar from "./atoms/AmmunitionBar.vue";
import BottomMessage from "./atoms/BottomMessage.vue";
import CargoSummary from "./molecules/CargoSummary.vue";

const paused: Ref<boolean> = ref(false);

const pauseButtonText: Ref<string> = computed(() => {
  if (paused.value) return "continue";
  else return "pause";
});

const onPauseButton = (e: Event) => {
  (<HTMLButtonElement>e.target).blur();

  if (paused.value) {
    paused.value = false;
    Manager.continueScene();
  } else {
    paused.value = true;
    Manager.pauseScene();
  }
};

const miningPercent: ComputedRef = computed(() => {
  return (
    (GameStateService.miningProgress.value /
      GameStateService.miningProgressLimit.value) *
    100
  );
});

watch(
  () => GameStateService.minedMatter.value,
  () => {
    if (GameStateService.minedMatter.value === 0) {
      GameStateService.gainedMatter.value = true;
      setTimeout(() => (GameStateService.gainedMatter.value = false), 1000);
    }
    GameStateService.minedChunksMessage.value = true;
    setTimeout(() => (GameStateService.minedChunksMessage.value = false), 1500);
  }
);
</script>

<template>
  <div class="
        absolute
        top-0
        left-0
        w-full
        h-full
        pointer-events-none
        text-white
        flex flex-col
        justify-between
        z-20
      ">
    <!-- header -->
    <div class="w-full h-12 flex justify-between items-start px-1.5">
      <div class="w-4/12 flex">
        <MarketTable/>
      </div>
      <div class="w-4/12 p-1 flex flex-col items-center">
          <TopBars/>
          <Heading/>
          <TopWarnings/>
      </div>
      <div class="w-4/12 flex justify-end items-start py-1">
        <ProgressBar/>
        <MoneyCounter/>
      </div>
    </div>

    <!-- mining progress bar -->
    <div
      class="
        transition-opacity
        duration-300
        absolute
        top-[50%]
        left-[50%]
        translate-x-[-50%] translate-y-[-50%]
      "
      :class="{ 'opacity-50': miningPercent > 0, 'opacity-0': miningPercent === 0 }"
    >
      <circle-progress
        :percent="miningPercent"
        class="m-auto"
        empty-color="transparent"
        fill-color="white"
        :border-width="4"
        :size="120"
        :transition="0"
      />
    </div>

    <!-- ammunition -->
    <div class="absolute right-2 top-[50%] translate-y-[-50%] border-white border-2 flex flex-col-reverse h-32 w-4 p-0.5 gap-1">
      <AmmunitionBar/>
    </div>

    <!-- bottom -->
    <div class="w-full px-1.5">

      <!-- Messages -->
      <div class="w-full flex justify-center items-center">
        <BottomMessage :show="GameStateService.canLand.value && !GameStateService.landed.value" background>
          Press <span class="text-white">Space</span> to land
        </BottomMessage>

        <BottomMessage :show="GameStateService.minedChunksMessage.value">
          You mined 1 matter chunk
        </BottomMessage>
      </div>

      <div class="w-full flex justify-between items-end h-16 pb-1">

        <!-- mined chunks-->
        <div class="w-3/12">
          <div class="py-1 px-2 w-fit bg-gray-400 font-bold text-sm" :class="{ 'jump-animation': GameStateService.minedChunksMessage.value }">
            {{ GameStateService.minedMatter.value }}/{{ GameStateService.minedMatterLimit.value }}
          </div>
        </div>

        <div class="w-6/12 flex justify-center items-center gap-2">
          <CargoSummary/>
        </div>
        <div class="w-3/12 flex justify-end">
          <div
            :class="GameStateService.totalCargo.value >= GameStateService.inventory.value.maxCargo ? 'bg-red-500 pop-animation' : 'bg-gray-900'">
            <p class="text-gray-100 font-bold text-sm px-2 py-1 uppercase">
              {{ GameStateService.totalCargo.value }}/{{ GameStateService.inventory.value.maxCargo }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
