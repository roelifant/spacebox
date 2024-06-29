<script setup lang="ts">
import ArrowIcon from "../icons/ArrowIcon.vue";
import GameStateService from "../../game/services/GameStateService";

const onHeadingLeft = (e: Event) => {
  e.preventDefault();
  (<HTMLButtonElement>e.target).blur();

  GameStateService.chosenHeading.value--;
  GameStateService.updateHeadings();
}

const onHeadingRight = (e: Event) => {
  e.preventDefault();
  (<HTMLButtonElement>e.target).blur();

  GameStateService.chosenHeading.value++;
  GameStateService.updateHeadings();
}
</script>

<template>
    <div class="flex justify-center items-center w-full mt-3 h-6 gap-2">
        <div
        @click="onHeadingLeft($event)"
            tabindex="-1"
            v-if="GameStateService.multipleHeadingOptions.value"
            class="opacity-50 hover:opacity-70 active:opacity-100 transition-opacity pointer-events-auto no-focus-style cursor-pointer">
            <ArrowIcon class="w-2 rotate-180" />
        </div>
        <p class="w-8/12 text-center text-sm">{{ GameStateService.headingText.value }}</p>
        <div
            @click="onHeadingRight($event)"
            tabindex="-1"
            v-if="GameStateService.multipleHeadingOptions.value"
            class="opacity-50 hover:opacity-70 active:opacity-100 transition-opacity pointer-events-auto no-focus-style cursor-pointer">
            <ArrowIcon class="w-2" />
        </div>
    </div>
</template>