<script setup lang="ts">
    import { Ref, computed, onMounted, ref } from 'vue';
    import GameStateService from '../game/services/GameStateService';
    import PlanetUIService from '../game/services/PlanetUIService';
    import Market from '../game/services/Market';
    import { Cargo } from '../game/enums/Cargo';
    import { Upgrade } from '../game/objects/Upgrade';
    import {title} from '../game/utils/StringManipulation';

    const itemInfoName: Ref<string|null> = ref(null);
    const itemInfoType: Ref<string|null> = ref(null);
    const itemInfo: Ref<string|null> = ref(null);

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
    });

    const showItemInfo = (name: string, info: string, type: string) => {
        itemInfo.value = info;
        itemInfoName.value = name;
        itemInfoType.value = type;
    }

    const hideItemInfo = () => {
        itemInfo.value = null;
        itemInfoName.value = null;
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
        <div class="mx-auto w-full mt-20 px-6">
            <h1 class="text-2xl font-bold mb-2">{{ PlanetUIService.planet?.name}}</h1>
            <div class="w-full border-2 p-4 flex justify-between">
                <div class="w-3/12 relative">
                    <div class="absolute transition-opacity duration-300" :class="{'opacity-0': !itemInfo}">
                        <h2 class="text-lg font-bold">{{ itemInfoName }} <span class="text-gray-500">({{ itemInfoType }})</span> </h2>
                        <p class="text-sm">{{ itemInfo }}</p>
                    </div>
                    <div class="absolute transition-opacity duration-300" :class="{'opacity-0': !!itemInfo}">
                        <h2 class="text-lg font-bold">Planet info</h2>
                        <p class="text-sm">{{ PlanetUIService.planet?.info }}</p>
                    </div>
                </div>
                <div class="w-9/12 pl-12">

                    <h2 class="text-lg font-bold border-b-2 pb-1">Shop</h2>

                            <h3 class="text-md pt-4">Basic</h3>

                            <div class="grid grid-cols-3 xl:grid-cols-4 w-full py-2 gap-2">
                                
                                <div class="border-2 flex items-center w-full gap-2">
                                    
                                    <div class="w-14 h-14 flex justify-center items-center border-r-2">
                                        <img :src="'./img/icons/Matter.png'" alt="fuel" class="w-8">
                                    </div>

                                    <div class="flex flex-col h-full justify-center pl-2 overflow-hidden flex-grow">
                                        <p class="truncate text-sm"><span class="font-bold">Fuel</span></p>
                                        <p class="text-xs">§ 25</p>
                                    </div>
                                    <button @click="buyFuel($event)" :disabled="!canBuyFuel"
                                        class="
                                            border-2
                                            text-white
                                            uppercase text-xs font-bold
                                            px-2 py-1 transition-colors
                                            ml-auto mr-2
                                        " :class="{
                                            'cursor-pointer opacity-100 hover:bg-white hover:text-black': canBuyFuel,
                                            'opacity-50 hover:bg-transparent hover:text-white': !canBuyFuel
                                            }">
                                        buy
                                    </button>
                                </div>
                            </div>
                            <h3 class="text-md pt-4">Cargo</h3>
                            <div class="grid grid-cols-3 xl:grid-cols-4 w-full py-2 gap-2">

                                <div
                                    class="border-2 flex items-center gap-2 w-full"
                                    v-for="cargo in selling" :key="cargo.key"
                                >
                                    <div class="w-14 h-14 flex justify-center items-center border-r-2">
                                        <img :src="'./img/icons/'+title(cargo.key)+'.png'" :alt="cargo.key" class="w-8">
                                    </div>

                                    <div class="flex flex-col h-full justify-center pl-2 overflow-hidden flex-grow">
                                        <p class="truncate text-sm"><span class="font-bold">{{title(cargo.key)}}</span> ({{cargo.count}})</p>
                                        <p class="text-xs">§ {{ Market.getBuyingPrice(cargo.key) }}</p>
                                    </div>

                                    <button @click="buyCargo($event, cargo.key)" :disabled="!Market.canBuy(cargo.key)"
                                        class="
                                            border-2
                                            text-white
                                            uppercase text-xs font-bold
                                            px-2 py-1 transition-colors
                                            ml-auto mr-2
                                        " :class="{
                                            'cursor-pointer opacity-100 hover:bg-white hover:text-black': Market.canBuy(cargo.key),
                                            'opacity-50 hover:bg-transparent hover:text-white': !Market.canBuy(cargo.key)
                                            }">
                                        buy
                                    </button>
                                </div>
                            </div>
                            
                            <h3 class="text-md pt-4">Upgrades</h3>
                            <div class="grid grid-cols-3 xl:grid-cols-4 w-full py-2 gap-2">
                                <div
                                    class="border-2 flex items-center gap-2 w-full"
                                    @mouseenter="showItemInfo(upgrade.name, upgrade.description, 'upgrade')"
                                    @mouseleave="hideItemInfo()"
                                    v-for="upgrade in upgrades" :key="upgrade.key"
                                >
                                    
                                    <div class="w-14 h-14 flex justify-center items-center border-r-2">
                                        <img :src="'./img/icons/'+upgrade.icon" alt="matter" class="w-8">
                                    </div>

                                    <div class="flex flex-col h-full justify-center pl-2 overflow-hidden flex-grow">
                                        <p class="truncate text-sm"><span class="font-bold">{{upgrade.name}}</span></p>
                                        <p class="text-xs">§ {{ upgrade.price }}</p>
                                    </div>

                                    <button
                                        @click="upgrade.purchase()"
                                        :disabled="!upgrade.canBuy()"
                                        class="
                                            border-2
                                            text-white
                                            uppercase text-xs font-bold
                                            px-2 py-1 transition-colors
                                            ml-auto mr-2
                                        " :class="{
                                            'cursor-pointer opacity-100 hover:bg-white hover:text-black':  upgrade.canBuy(),
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