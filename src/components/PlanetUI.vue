<script setup lang="ts">
    import { computed, ComputedRef } from 'vue';
    import GameStateService from '../game/services/GameStateService';
    import PlanetUIService from '../game/services/PlanetUIService';
    import Market from '../game/services/Market';
    import { Cargo } from '../game/enums/Cargo';
import { Upgrade } from '../game/objects/Upgrade';

    const onTakeOffButtonClick = (e: Event) => {
        (<HTMLButtonElement>e.target).blur();

        PlanetUIService.takeOff();
    }

    const canBuyFuel = computed(() => GameStateService.inventory.value.money >= 25 && GameStateService.inventory.value.fuel < GameStateService.inventory.value.maxFuel);

    const buyFuel = (e: Event) => {
        (<HTMLButtonElement>e.target).blur();

        if(!canBuyFuel.value) return;
        GameStateService.inventory.value.money -= 25;
        GameStateService.gainFuel(150);
    }

    const buyCargo = (e: Event, cargo: Cargo) => {
        (<HTMLButtonElement>e.target).blur();

        Market.buy(cargo);
    }

    const selling = computed(() => {

        if(!PlanetUIService.cargoInventory.value) return [];

        const raw = [...Object.entries(PlanetUIService.cargoInventory.value)];
        let selling: Array<any> = [];
        raw.forEach((entry: any) => {
            if(entry[1] > 0){
                selling.push({key: entry[0], count: entry[1]});
            }
        });
        return selling;
    });

    const upgrades = computed(() => {
        if(!PlanetUIService.upgrades.value) return [];

        const raw = [...PlanetUIService.upgrades.value];
        let upgrades: Array<Upgrade> = [];
        raw.forEach((upgrade: Upgrade) => {
            if(!upgrade.active){
                upgrades.push(upgrade);
            }
        });
    return upgrades;
    })
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
        <div class="mx-auto w-10/12 mt-20">
            <h1 class="text-2xl font-bold mb-2">{{ PlanetUIService.planet?.name}}</h1>
            <div class="w-full border-2 p-4 flex justify-between">
                <div class="w-4/12">
                    <h2 class="text-lg font-bold">Info</h2>
                    <p class="text-sm">{{ PlanetUIService.planet?.info}}</p>
                </div>
                <div class="w-8/12 pl-12">
                    <h2 class="text-lg font-bold">Shop</h2>
                    <h3 class="text-md">Essentials:</h3>
                    <div class="flex w-full gap-4 p-4">
                        <div class="p-2 border-2 flex flex-col justify-between items-center w-28 gap-1">
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
                    <div class="flex w-full gap-4 p-4">
                        <div
                            class="p-2 border-2 flex flex-col justify-between items-center w-28 gap-2"
                            v-for="cargo in selling" :key="cargo.key"
                        >
                            <p><span class="font-bold">{{cargo.key}}</span> ({{cargo.count}})</p>
                            <p class="text-sm">§ {{ Market.getBuyingPrice(cargo.key) }}</p>
                            <button @click="buyCargo($event, cargo.key)" :disabled="!Market.canBuy(cargo.key)"
                                class="
                                    border-2
                                    text-white
                                    uppercase text-sm font-bold
                                    px-2 py-1 transition-colors
                                " :class="{
                                    'cursor-pointer opacity-100 hover:bg-white hover:text-black': Market.canBuy(cargo.key),
                                    'opacity-50 hover:bg-transparent hover:text-white': !Market.canBuy(cargo.key)
                                    }">
                                buy
                            </button>
                        </div>
                    </div>
                    <h3 class="text-md">Upgrades:</h3>
                    <div class="flex w-full gap-4 p-4">
                        <div
                            class="p-2 border-2 flex flex-col justify-between items-center w-28 gap-2"
                            v-for="upgrade in upgrades" :key="upgrade.key"
                        >
                            <p><span class="font-bold">{{upgrade.name}}</span></p>
                            <p class="text-sm">§ {{ upgrade.price }}</p>
                            <button @click="upgrade.purchase()" :disabled="!upgrade.canBuy()"
                                class="
                                    border-2
                                    text-white
                                    uppercase text-sm font-bold
                                    px-2 py-1 transition-colors
                                " :class="{
                                    'cursor-pointer opacity-100 hover:bg-white hover:text-black': upgrade.canBuy(),
                                    'opacity-50 hover:bg-transparent hover:text-white': !upgrade.canBuy()
                                    }">
                                buy
                            </button>
                        </div>
                    </div>
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