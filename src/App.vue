<script setup lang="ts">
  import {Manager} from './game/Manager'
  import {Load} from './game/scenes/Load';
  import {Keyboard} from "./game/Keyboard";
  import {Mouse} from "./game/Mouse";
  import { onMounted } from '@vue/runtime-core';
  import FlightUI from './components/FlightUI.vue';
  import LoadUI from './components/LoadUI.vue';
  import PlanetUI from './components/PlanetUI.vue';
  import GameOverUI from './components/GameOverUI.vue';
  import MobileWarningScreen from './components/MobileWarningScreen.vue';


  onMounted(() => {
    Manager.init(0x000000);

    Keyboard.init();
    Mouse.init();
    Manager.changeScene(new Load())
  });
</script>

<template>
  <div id="pixi-content" class="bg-black w-full h-full">
    <canvas id="pixi-canvas" />
  </div>
  <LoadUI/>
  <GameOverUI/>
  <PlanetUI/>
  <FlightUI/>
  <MobileWarningScreen/>
</template>

<style scoped>
</style>
