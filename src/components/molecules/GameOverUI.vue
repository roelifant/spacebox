<script setup lang="ts">
import GameStateService from '../../game/services/GameStateService';

const respawn = () => GameStateService.respawn();
</script>

<template>
<transition>
    <div v-show="GameStateService.gameOver.value" class="absolute top-0 left-0 w-full h-full text-white flex flex-col justify-center items-center z-30">
        <div class="bg-red-600 w-full h-full opacity-30 absolute top-0 left-0 z-0"/>
        <div class="space-y-6 z-10 bg-red-600 p-6 w-5/12">
            <p class="uppercase font-bold text-3xl text-center">Game over</p>
            <p class="text-center">{{GameStateService.gameOverMessage.value}}</p>
            <div class="w-full flex justify-center">
                <button @click="respawn" class="border-2 border-white uppercase font-bold text-sm py-1 px-2 transition-color duration-300 hover:text-red-600 hover:bg-white">Respawn</button>
            </div>
        </div>
    </div>
</transition>
</template>

<style scoped>
    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.5s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
</style>
