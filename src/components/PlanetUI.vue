<script setup lang="ts">
    import PlanetUIService from '../game/services/PlanetUIService';

    const onTakeOffButtonClick = (e: Event) => {
        (<HTMLButtonElement>e.target).blur();

        PlanetUIService.takeOff();
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
        <div class="mx-auto w-8/12 mt-12">
            <h1 class="text-2xl font-bold mb-2">Planet name</h1>
            <div class="w-full border-2 p-4 flex justify-between">
                <div class="w-4/12">
                    <h2 class="text-lg font-bold">Info</h2>
                    <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
                <div class="w-8/12 pl-12">
                    <h2 class="text-lg font-bold">Shop</h2>
                    <h3 class="text-md">Essentials:</h3>
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