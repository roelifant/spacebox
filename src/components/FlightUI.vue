<script setup lang="ts">
import { Manager } from "../game/Manager";
import {computed, Ref, ref, watch} from 'vue';
import GameStateService from '../game/services/GameStateService';

    const paused: Ref<boolean> = ref(false);

    const pauseButtonText: Ref<string> = computed(() => {
        if(paused.value) return "continue";
        else return "pause";
    })

    const onPauseButton = (e: Event) => {
        (<HTMLButtonElement>e.target).blur();

        if(paused.value) {
            paused.value = false;
            Manager.continueScene();
        }
        else {
            paused.value = true;
            Manager.pauseScene();
        }
    }

    const fuelPercent = computed(() => {
        if(GameStateService.inventory.value.fuel < 0) return 0;
        else return Math.floor(GameStateService.inventory.value.fuel / GameStateService.inventory.value.maxFuel * 100);
    });
</script>

<template>
  <div class="absolute top-0 left-0 w-full h-full pointer-events-none text-white flex flex-col justify-between z-20">
      <!-- header -->
      <div class="w-full h-12 flex justify-between items-start px-1.5">
          <div class="w-4/12"/>
          <div class="w-4/12 p-1 flex justify-center">
            <div class="w-full border-2 border-white h-4 p-0.5">
                <div class="bg-orange-300 h-full transition-all" :class="'w-['+fuelPercent+'%]'" />
                <transition>
                    <div v-show="fuelPercent <= 30">
                        <p class="text-red-500 text-center uppercase font-bold text-sm mt-3 animate-pulse">
                            <i class="fa-solid fa-triangle-exclamation pr-1"/> low fuel <i class="fa-solid fa-triangle-exclamation pl-1"/>
                        </p>
                    </div>
                </transition>
            </div>
          </div>
          <div class="w-4/12 flex justify-end py-1">
            <p class=" px-2 font-bold text-lgl bg-gray-600 text-gray-400">§ <span class="text-white">{{GameStateService.inventory.value.money}}</span></p>
          </div>
      </div>

      <!-- bottom -->
      <div class="w-full h-12 px-1.5">
          <div class="w-full flex justify-center items-center">
                <transition>
                    <p v-show="GameStateService.canLand.value && !GameStateService.landed.value" class="bg-gray-600 text-gray-400 uppercase px-3 py-1 text-xs font-bold">
                        Press <span class="text-white">Space</span> to land
                    </p>
                </transition>
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
</style>
