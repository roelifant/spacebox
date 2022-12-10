<script setup lang="ts">
    import { computed } from 'vue';
import GameStateService from '../game/services/GameStateService';
import PlanetUIService from '../game/services/PlanetUIService';

    const onTakeOffButtonClick = (e: Event) => {
        (<HTMLButtonElement>e.target).blur();

        PlanetUIService.takeOff();
    }

    const canBuyFuel = computed(() => GameStateService.inventory.value.money >= 25 && GameStateService.inventory.value.fuel < GameStateService.inventory.value.maxFuel);

    const buyFuel = (e: Event) => {
        (<HTMLButtonElement>e.target).blur();

        if(!canBuyFuel.value) return;
        GameStateService.inventory.value.money -= 25;
        GameStateService.gainFuel(100);
    }
</script>

<template>
    <div class="
        absolute top-0 left-0 z-10
        w-full h-full
        pointer-events-none
        text-white bg-black
        transition-opacity duration-300
    " :class="{
        'opacity-0': !PlanetUIService.shown.value,
        'pointer-events-auto': PlanetUIService.shown.value
    }">
        <div class="mx-auto w-8/12 mt-20">
            <h1 class="text-2xl font-bold mb-2">Planet name</h1>
            <div class="w-full border-2 p-4 flex justify-between">
                <div class="w-4/12">
                    <h2 class="text-lg font-bold">Info</h2>
                    <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
                <div class="w-8/12 pl-12">
                    <h2 class="text-lg font-bold">Shop</h2>
                    <h3 class="text-md">Essentials:</h3>
                    <div class="flex w-full justify-between gap-2 p-4">
                        <div class="p-2 border-2 flex flex-col justify-between items-center w-28 gap-2">
                            <p class="font-bold">Fuel</p>
                            <p class="text-sm">§ 25</p>
                            <button @click="buyFuel($event)" :disabled="!canBuyFuel"
                                class="
                                    border-2
                                    text-white
                                    uppercase text-sm font-bold
                                    px-2 py-1 transition-colors
                                " :class="{
                                    'cursor-pointer opacity-100 hover:bg-white hover:text-black': canBuyFuel,
                                    'opacity-50 hover:bg-transparent hover:text-white': !canBuyFuel
                                    }">
                                buy
                            </button>
                        </div>
                    </div>
                    <h3 class="text-md">Cargo:</h3>
                    <h3 class="text-md">Upgrades:</h3>
                </div>
            </div>
            <div class="w-full flex justify-end">
                <button @click="onTakeOffButtonClick($event)" class="border-2 hover:bg-white hover:text-black text-white uppercase text-sm font-bold px-4 py-2 mt-4 transition-colors">
                    Take off
                </button>
            </div>
        </div>
    </div>
</template>