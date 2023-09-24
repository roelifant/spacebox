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

    const canBuyRepair = computed(() => GameStateService.inventory.value.money >= 25 && GameStateService.inventory.value.hull < GameStateService.inventory.value.maxHull);
    const repairPrice = computed(() => (GameStateService.inventory.value.maxHull - GameStateService.inventory.value.hull) * 25);
    const needsRepair  = computed(() => GameStateService.inventory.value.maxHull !== GameStateService.inventory.value.hull);

    const buyRepair = (e: Event) => {
        (<HTMLButtonElement>e.target).blur();

        if(!canBuyRepair.value) return;
        GameStateService.inventory.value.money -= repairPrice.value;
        GameStateService.inventory.value.hull = GameStateService.inventory.value.maxHull;
    }

    const canBuyAmmo = computed(() => GameStateService.inventory.value.money >= 25 && GameStateService.inventory.value.ammo < GameStateService.inventory.value.maxAmmo);

    const buyAmmo = (e: Event) => {
        (<HTMLButtonElement>e.target).blur();

        if(!canBuyFuel.value) return;
        GameStateService.inventory.value.money -= 25;
        GameStateService.gainAmmo(10);
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

    const showCargoInfo = (cargo: Cargo) => {
        let name, info;
        const type = 'cargo';

        if(cargo === Cargo.Matter){
            name = 'Matter';
            info = 'All sorts of materials are traded between planets for their mass alone. In this trade the nature and the origin of the materials are not important, as long as they are not dangerous or inpractical to transport. While matter is considered the cheapest of all interstellar cargo it is invaluable for terraformers looking to alter the gravitational pull of their world, since a planet\'s gravity is dictated by its mass. Usually such amorphous matter is mined from asteroids along with ice and minerals, but some planets will also sell it if they don\'t need the gravity.'
        }

        if(cargo === Cargo.Water){
            name = 'Water';
            info = 'Since it\'s the juice of life, all settled planets need water. Usually water is mined in the form of ice from asteroids, allthough this process is more expensive than mining simple matter. There are also enough worlds that have too much ice on their surface and don\'t mind selling it to traders.'
        }

        if(cargo === Cargo.Flora){
            name = 'Flora';
            info = 'Once a difficult resource to comeby, flora are now transported freely throughout the galaxy. As primary producers, plants are needed to form the fundament of any biological climate. They do not grow in the cold void of space, so they must be obtained from planets.';
        }

        if(cargo === Cargo.Minerals){
            name = 'Minerals';
            info = 'Not all matter is equal. Some elements, molecules or crystaloid structures are expensive to recreate through synthetic processes. Because of this there is a demand for special, valuable materials found in rare asteroids or on planets that have the geology to naturally produce them. Minerals are considerably more valuable than ordinary matter and so they are more expensive to buy, but also more profitable to sell.';
        }

        if(cargo === Cargo.Fauna){
            name = 'Fauna';
            info = 'Biodiversity is invaluable. While some are just exotic pets, most fauna cargo are important collections of eukaryotes or invertibrates that any healthy world needs to maintain life. Not all life is easy to transport though, and this is what makes fauna more pricey than their flora counterparts.';
        }

        if(cargo === Cargo.Fungi){
            name = 'Fungi';
            info = 'The often forgotten, but vital part of any eco system. Fungi are transported all over the galaxy to stabilize climates and for medicinal and scientific purposes.';
        }

        if(cargo === Cargo.Energy){
            name = 'Energy';
            info = 'Just like your ship needs fuel, civilisations need to keep their lights on too. While many planets have their energy needs taken care of, other worlds are desperate to power their cities. Interstaller traders taking care of this demand, are not unheard of.';
        }

        if(cargo === Cargo.Weaponry){
            name = 'Weaponry';
            info = 'There is no business more profitable than war. Profitable as it is though, traders should beware that not all worlds appreciate the import of weapons.';
        }

        if(cargo === Cargo.Technology){
            name = 'Technology';
            info = 'Robotics, medicine, tools and even new theoretical methods. Few worlds are advanced enough, or even willing, to share their scientific findings and feats of engineering with others. But those that do will make a great profit and so will you.';
        }

        if(cargo === Cargo.Wisdom){
            name = 'Wisdom';
            info = 'One might not expect that the most intangible exports of all, could also be the most profitable. But that in itself requires much wisdom to understand. Culture, philosophy, religion and grand ideas of alien nature are in demand all over the galaxy. However, beware that some worlds might not appreciate rogue traders selling new ideas to people, that conflict with the ideas that those in power have already sold...';
        }

        if(name && info) showItemInfo(name, info, type);
    }

    const showFuelInfo = () => {
        showItemInfo(
            'Fuel',
            'Needed to travel through space. The more manoeuvres you make (turning, breaking, accelerating,...) the more fuel you will spend while flying.',
            'basics'
        );
    }

    const showRepairInfo = () => {
        showItemInfo(
            'Repair',
            'Repair your damaged ship. Costs more depending on the damage.',
            'basics'
        );
    }

    const showAmmoInfo = () => {
        showItemInfo(
            'Ammunition',
            'Stock up on ammunition to defend yourself from raiding pirates. Each clip holds 10 bullets.',
            'basics'
        );
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
        <div class="mx-auto w-full mt-20 px-8">
            <h1 class="text-2xl font-bold mb-2">{{ PlanetUIService.planet?.name}}</h1>
            <div class="w-full border-2 p-4 flex justify-between">
                <div class="w-3/12 relative">
                    <div class="absolute transition-opacity duration-300" :class="{'opacity-0': !itemInfo}">
                        <h2 class="text-lg font-bold">{{ itemInfoName }} <span class="text-gray-500 font-normal text-sm">({{ itemInfoType }})</span> </h2>
                        <p class="text-sm">{{ itemInfo }}</p>
                    </div>
                    <div class="absolute transition-opacity duration-300" :class="{'opacity-0': !!itemInfo}">
                        <h2 class="text-lg font-bold">Planet info</h2>
                        <p class="text-sm">{{ PlanetUIService.planet?.info }}</p>
                    </div>
                </div>
                <div class="w-9/12 pl-12">

                    <h2 class="text-lg font-bold border-b-2 pb-1">Shop</h2>

                            <h3 class="text-md pt-4">Basics</h3>

                            <div class="grid grid-cols-3 xl:grid-cols-4 w-full py-2 gap-2">
                                
                                <div
                                    @mouseenter="showFuelInfo()"
                                    @mouseleave="hideItemInfo()"
                                    class="border-2 flex items-center w-full gap-2"
                                >
                                    
                                    <div class="w-14 h-14 flex justify-center items-center border-r-2">
                                        <img :src="'./img/icons/Fuel.png'" alt="fuel" class="w-10 h-10 object-contain">
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

                                <div
                                    @mouseenter="showAmmoInfo()"
                                    @mouseleave="hideItemInfo()"
                                    class="border-2 flex items-center w-full gap-2"
                                >
                                    
                                    <div class="w-14 h-14 flex justify-center items-center border-r-2">
                                        <img :src="'./img/icons/Fuel.png'" alt="fuel" class="w-10 h-10 object-contain">
                                    </div>

                                    <div class="flex flex-col h-full justify-center pl-2 overflow-hidden flex-grow">
                                        <p class="truncate text-sm"><span class="font-bold">Ammunition</span></p>
                                        <p class="text-xs">§ 25</p>
                                    </div>
                                    <button @click="buyAmmo($event)" :disabled="!canBuyAmmo"
                                        class="
                                            border-2
                                            text-white
                                            uppercase text-xs font-bold
                                            px-2 py-1 transition-colors
                                            ml-auto mr-2
                                        " :class="{
                                            'cursor-pointer opacity-100 hover:bg-white hover:text-black': canBuyAmmo,
                                            'opacity-50 hover:bg-transparent hover:text-white': !canBuyAmmo
                                            }">
                                        buy
                                    </button>
                                </div>

                                <div
                                    @mouseenter="showRepairInfo()"
                                    @mouseleave="hideItemInfo()"
                                    v-show="needsRepair"
                                    class="border-2 flex items-center w-full gap-2"
                                >
                                    
                                    <div class="w-14 h-14 flex justify-center items-center border-r-2">
                                        <img :src="'./img/icons/Fuel.png'" alt="fuel" class="w-10 h-10 object-contain">
                                    </div>

                                    <div class="flex flex-col h-full justify-center pl-2 overflow-hidden flex-grow">
                                        <p class="truncate text-sm"><span class="font-bold">Repair</span></p>
                                        <p class="text-xs">§ {{ repairPrice }}</p>
                                    </div>
                                    <button @click="buyRepair($event)" :disabled="!canBuyRepair"
                                        class="
                                            border-2
                                            text-white
                                            uppercase text-xs font-bold
                                            px-2 py-1 transition-colors
                                            ml-auto mr-2
                                        " :class="{
                                            'cursor-pointer opacity-100 hover:bg-white hover:text-black': canBuyRepair,
                                            'opacity-50 hover:bg-transparent hover:text-white': !canBuyRepair
                                            }">
                                        buy
                                    </button>
                                </div>
                            </div>
                            <h3 class="text-md pt-4">Cargo</h3>
                            <div class="grid grid-cols-3 xl:grid-cols-4 w-full py-2 gap-2">

                                <div
                                    class="border-2 flex items-center gap-2 w-full"
                                    @mouseenter="showCargoInfo(cargo.key)"
                                    @mouseleave="hideItemInfo()"
                                    v-for="cargo in selling" :key="cargo.key"
                                >
                                    <div class="w-14 h-14 flex justify-center items-center border-r-2">
                                        <img :src="'./img/icons/'+title(cargo.key)+'.png'" :alt="cargo.key" class="w-10 h-10 object-contain">
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
                                        <img :src="'./img/icons/'+upgrade.icon" alt="matter" class="w-10 h-10 object-contain">
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