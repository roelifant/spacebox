<script setup lang="ts">
  import {Manager} from './game/Manager'
  import {Load} from './game/scenes/Load';
  import {Keyboard} from "./game/Keyboard";
  import {Mouse} from "./game/Mouse";
  import { onMounted } from '@vue/runtime-core';
  import FlightUI from './components/organisms/FlightUI.vue';
  import LoadUI from './components/organisms/LoadUI.vue';
  import PlanetUI from './components/organisms/PlanetUI.vue';
  import GameOverUI from './components/molecules/GameOverUI.vue';
  import MobileWarningScreen from './components/organisms/MobileWarningScreen.vue';
  import PauseMenu from './components/organisms/PauseMenu.vue';
  import StartScreen from './components/organisms/StartScreen.vue';
  import { ref } from 'vue';

  const showStartScreen = ref(true);

  const onStart = (slot: string) => {
    console.log(slot);

    Manager.init(0x000000);
    Keyboard.init();
    Mouse.init();
    showStartScreen.value = false;
    Manager.changeScene(new Load());
  }
</script>

<template>
  <div id="pixi-content" class="bg-black w-full h-full">
    <canvas id="pixi-canvas" />
  </div>
  <LoadUI/>
  <GameOverUI/>
  <PlanetUI/>
  <FlightUI/>
  <PauseMenu/>
  <StartScreen v-if="showStartScreen" @start="onStart($event)"/>
  <MobileWarningScreen/>
</template>

<style scoped>
</style>
