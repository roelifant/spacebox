<script setup lang="ts">
import { Manager } from '../../game/Manager';
import { World } from '../../game/scenes/World';
import GameStateService from '../../game/services/GameStateService';
import Button from '../atoms/Button.vue';
import ProgressBar from '../molecules/ProgressBar.vue';

const onContinue = () => {
    (<World>Manager.scene).pauseTrigger();
}

const onReload = () => {
    window.location.reload();
};
</script>

<template>
    <Transition>
        <div
            v-show="GameStateService.showPauseMenu.value"
            :class="{'pointer-events-none': !GameStateService.showPauseMenu.value}"
            class="
            w-full h-full
            absolute top-0 left-0
            bg-black text-white
            z-30
            flex flex-col justify-center items-center
            px-20
        ">
        <div
            class="
                flex flex-col justify-center
                w-40
                gap-4
            "
        >
            <p class="text-3xl uppercase font-bold text-center">Paused</p>
            <Button @click="onContinue">
                Continue
            </Button>
            <Button @click="onReload">
                Return to menu
            </Button>
            <ProgressBar/>
        </div>
        
    </div>
    </Transition>
</template>

<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>