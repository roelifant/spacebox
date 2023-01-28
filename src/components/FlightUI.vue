<script setup lang="ts">
import { Manager } from "../game/Manager";
import { computed, ComputedRef, Ref, ref, watch } from "vue";
import GameStateService from "../game/services/GameStateService";
import "vue3-circle-progress/dist/circle-progress.css";
import CircleProgress from "vue3-circle-progress";
import PlanetUIService from '../game/services/PlanetUIService';
import Market from '../game/services/Market';
import {Cargo} from '../game/enums/Cargo';

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

const fuelPercent: ComputedRef = computed(() => {
  if (GameStateService.inventory.value.fuel < 0) return 0;
  else
    return Math.floor(
      (GameStateService.inventory.value.fuel /
        GameStateService.inventory.value.maxFuel) *
        100
    );
});

const miningPercent: ComputedRef = computed(() => {
  return (
    (GameStateService.miningProgress.value /
      GameStateService.miningProgressLimit.value) *
    100
  );
});

const minedChunksMessage: Ref<boolean> = ref(false);
const gainedMatter: Ref<boolean> = ref(false);
watch(
  () => GameStateService.minedMatter.value,
  () => {
      if(GameStateService.minedMatter.value === 0){
          gainedMatter.value = true;
          setTimeout(() => (gainedMatter.value = false), 1000);
      }
    minedChunksMessage.value = true;
    setTimeout(() => (minedChunksMessage.value = false), 1500);
  }
);

const matterSellingPrice: ComputedRef = computed(() => Market.getSellingPrice(Cargo.Matter));
</script>

<template>
  <div
    class="
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
    "
  >
    <!-- header -->
    <div class="w-full h-12 flex justify-between items-start px-1.5">
      <div class="w-4/12" />
      <div class="w-4/12 p-1 flex justify-center">
        <div class="w-full border-2 border-white h-4 p-0.5">
          <div
            class="bg-orange-300 h-full transition-all"
            :class="'w-[' + fuelPercent + '%]'"
          />
          <transition>
            <div v-show="fuelPercent <= 30">
              <p
                class="
                  text-red-500 text-center
                  uppercase
                  font-bold
                  text-sm
                  mt-3
                  animate-pulse
                "
              >
                <i class="fa-solid fa-triangle-exclamation pr-1" /> low fuel
                <i class="fa-solid fa-triangle-exclamation pl-1" />
              </p>
            </div>
          </transition>
        </div>
      </div>
      <div class="w-4/12 flex justify-end py-1">
        <p class="px-2 font-bold text-lgl bg-gray-600 text-gray-400">
          §
          <span class="text-white">{{
            GameStateService.inventory.value.money
          }}</span>
        </p>
      </div>
    </div>

    <!-- mining progress bar -->
    <div
      class="
        opacity-0
        transition-opacity
        duration-300
        absolute
        top-[50%]
        left-[50%]
        translate-x-[-50%] translate-y-[-50%]
      "
      :class="{ 'opacity-50': miningPercent > 0 }"
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

    <!-- bottom -->
    <div class="w-full px-1.5">
      <!-- Messages -->
      <div class="w-full flex justify-center items-center">

        <transition>
            <p
            v-show="
              GameStateService.canLand.value && !GameStateService.landed.value
            "
            class="
              bg-gray-600
              text-gray-400
              uppercase
              px-3
              py-1
              text-xs
              font-bold
            "
          >
            Press <span class="text-white">Space</span> to land
          </p>
          </transition>

        <transition>
          <p
            v-show="
              minedChunksMessage
            "
            class="
              text-gray-400
              uppercase
              px-3
              py-1
              text-xs
              font-bold
            "
          >
            You mined 1 matter chunk
          </p>
        </transition>
      </div>

      <div class="w-full flex justify-between items-end h-16 pb-1">
        <div class="w-3/12">
            <div class="py-1 px-2 w-fit bg-gray-400 font-bold text-sm" :class="{'jump-animation': minedChunksMessage}">
                {{ GameStateService.minedMatter.value }}/{{GameStateService.minedMatterLimit.value}}
            </div>
        </div>
        <div class="w-6/12 flex justify-center items-center">
          <div
            class="
              bg-gray-400
              flex flex-col
              justify-center
              items-center
              w-16
              py-1
              relative
            "
            :class="{'jump-animation': gainedMatter}"
          >
            <p
                class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
                :class="{'opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.matter > 0}"
            >§ {{matterSellingPrice}}</p>
            <div class="
                absolute top-0 left-0
                w-full h-full
                bg-black border-2
                opacity-0 hover:opacity-100 transition-opacity
                flex flex-col justify-center
                cursor-pointer
            "
            @click="Market.sell(Cargo.Matter)"
            :class="{'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.matter > 0}"
            >
                <p class="font-bold text-center">
                {{ GameStateService.inventory.value.matter }}
                </p>
                <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p
                class="font-bold"
                :class="{'opacity-70': GameStateService.inventory.value.matter <= 0}"
            >
              {{ GameStateService.inventory.value.matter }}
            </p>
            <p class="text-xs uppercase">Matter</p>
          </div>
        </div>
        <div class="w-3/12" />
      </div>
    </div>
  </div>
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

.jump-animation {
    animation: jump .3s linear;
}

@keyframes jump {
    0%{transform: translateY(0)}
    50%{transform: translateY(-10px)}
    100%{transform: translateY(0)}
}
</style>
