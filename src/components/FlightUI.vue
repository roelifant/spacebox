<script setup lang="ts">
import { Manager } from "../game/Manager";
import { computed, ComputedRef, Ref, ref, watch } from "vue";
import GameStateService from "../game/services/GameStateService";
import "vue3-circle-progress/dist/circle-progress.css";
import CircleProgress from "vue3-circle-progress";
import PlanetUIService from '../game/services/PlanetUIService';
import Market from '../game/services/Market';
import {Cargo} from '../game/enums/Cargo';
import gsap from 'gsap';
import { Planet } from "../game/objects/Planet";

const paused: Ref<boolean> = ref(false);

const pauseButtonText: Ref<string> = computed(() => {
  if (paused.value) return "continue";
  else return "pause";
});

const onPauseButton = (e: Event) => {
  (<HTMLButtonElement>e.target).blur();

  if (paused.value) {
    paused.value = false;
    Manager.continueScene();
  } else {
    paused.value = true;
    Manager.pauseScene();
  }
};

const fuelPercent: ComputedRef = computed(() => {
  if (GameStateService.inventory.value.fuel < 0) return 0;
  else
    return Math.floor(
      (GameStateService.inventory.value.fuel /
        GameStateService.inventory.value.maxFuel) *
        100
    );
});

const miningPercent: ComputedRef = computed(() => {
  return (
    (GameStateService.miningProgress.value /
      GameStateService.miningProgressLimit.value) *
    100
  );
});

const minedChunksMessage: Ref<boolean> = ref(false);
const gainedMatter: Ref<boolean> = ref(false);
watch(
  () => GameStateService.minedMatter.value,
  () => {
      if(GameStateService.minedMatter.value === 0){
          gainedMatter.value = true;
          setTimeout(() => (gainedMatter.value = false), 1000);
      }
    minedChunksMessage.value = true;
    setTimeout(() => (minedChunksMessage.value = false), 1500);
  }
);


const matterSellingPrice: Ref = ref(Market.getSellingPrice(Cargo.Matter));
const waterSellingPrice: Ref = ref(Market.getSellingPrice(Cargo.Water));
const floraSellingPrice: Ref = ref(Market.getSellingPrice(Cargo.Flora));
const mineralsSellingPrice: Ref = ref(Market.getSellingPrice(Cargo.Minerals));
const faunaSellingPrice: Ref = ref(Market.getSellingPrice(Cargo.Fauna));
const fungiSellingPrice: Ref = ref(Market.getSellingPrice(Cargo.Fungi));
const energySellingPrice: Ref = ref(Market.getSellingPrice(Cargo.Energy));
const wisdomSellingPrice: Ref = ref(Market.getSellingPrice(Cargo.Wisdom));
const weaponrySellingPrice: Ref = ref(Market.getSellingPrice(Cargo.Weaponry));
const technologySellingPrice: Ref = ref(Market.getSellingPrice(Cargo.Technology));

watch(() => PlanetUIService.shown.value, () => {
  if(PlanetUIService.shown.value){
    matterSellingPrice.value = Market.getSellingPrice(Cargo.Matter);
    waterSellingPrice.value = Market.getSellingPrice(Cargo.Water);
    floraSellingPrice.value = Market.getSellingPrice(Cargo.Flora);
    mineralsSellingPrice.value = Market.getSellingPrice(Cargo.Minerals);
    faunaSellingPrice.value = Market.getSellingPrice(Cargo.Fauna);
    fungiSellingPrice.value = Market.getSellingPrice(Cargo.Fungi);
    energySellingPrice.value = Market.getSellingPrice(Cargo.Energy);
    wisdomSellingPrice.value = Market.getSellingPrice(Cargo.Wisdom);
    weaponrySellingPrice.value = Market.getSellingPrice(Cargo.Weaponry);
    technologySellingPrice.value = Market.getSellingPrice(Cargo.Technology);
  }
})

const moneyPopAnimation: Ref<boolean> = ref(false);
const onSell = (cargo: Cargo) => {
    Market.sell(cargo);
    moneyPopAnimation.value = true;
    setTimeout(() => moneyPopAnimation.value = false, 300);
}
const animatedMoney: Ref<any> = ref({value: GameStateService.inventory.value.money});
watch(() => GameStateService.inventory.value.money, (currentMoney) => {
    gsap.to(animatedMoney.value, {value: currentMoney, duration: .5});
});

const marketHigh: ComputedRef<Cargo> = computed(() => GameStateService.marketHigh.value);
const marketLow: ComputedRef<Cargo> = computed(() => GameStateService.marketLow.value);
const marketHighAnimation: Ref<boolean> = ref(false);
const marketLowAnimation: Ref<boolean> = ref(false);
watch(() => marketHigh.value, () => {
  marketHighAnimation.value = true;
  setTimeout(() => marketHighAnimation.value = false, 1000);
});
watch(() => marketLow.value, () => {
  marketLowAnimation.value = true;
  setTimeout(() => marketLowAnimation.value = false, 1000);
});
</script>

<template>
  <div
    class="
      absolute
      top-0
      left-0
      w-full
      h-full
      pointer-events-none
      text-white
      flex flex-col
      justify-between
      z-20
    "
  >
    <!-- header -->
    <div class="w-full h-12 flex justify-between items-start px-1.5">
      <div class="w-4/12 flex">
        <div class="grid grid-cols-[45px_auto] pt-1">
          <p
            :class="{'flash-animation': marketHighAnimation}"
            class="text-xs border-2 border-white p-1 border-r-0 bg-gray-300 text-black font-bold uppercase text-center"
          >high</p>
          <p
            class="text-xs border-2 border-white p-1 px-2 uppercase transition-all"
            :class="'bg-cargo-'+marketHigh"
          >
            <span class="block" :class="{'pop-animation': marketHighAnimation}">
              {{marketHigh}}
            </span>
          </p>
          <p
            :class="{'flash-animation': marketLowAnimation}"
            class="text-xs border-2 border-white p-1 border-r-0 border-t-0 bg-gray-500 text-black font-bold uppercase text-center"
          >Low</p>
          <p
            class="text-xs border-2 border-white p-1 px-2 border-t-0 uppercase transition-all"
            :class="'bg-cargo-'+marketLow"
          >
            <span class="block" :class="{'pop-animation': marketLowAnimation}">
              {{marketLow}}
            </span>
          </p>
        </div>
      </div>
      <div class="w-4/12 p-1 flex justify-center">
        <div class="w-full border-2 border-white h-4 p-0.5">
          <div
            class="bg-orange-300 h-full transition-all"
            :class="'w-[' + fuelPercent + '%]'"
          />
          <transition>
            <div v-show="fuelPercent <= 30">
              <p
                class="
                  text-red-500 text-center
                  uppercase
                  font-bold
                  text-sm
                  mt-3
                  animate-pulse
                "
              >
                <i class="fa-solid fa-triangle-exclamation pr-1" /> low fuel
                <i class="fa-solid fa-triangle-exclamation pl-1" />
              </p>
            </div>
          </transition>
        </div>
      </div>
      <div class="w-4/12 flex justify-end py-1">
        <div class="flex items-center pr-6 gap-2">
          <p class="text-xs uppercase">progress</p>
          <div class="w-28 border-2 border-white h-2">
            <div :class="'w-['+GameStateService.upgradePercent?.value+'%]'" class="h-full bg-white transition-all">

            </div>
          </div>
          <p class="text-xs">{{GameStateService.upgradePercent?.value}}%</p>
        </div>
        <p class="px-2 font-bold text-lgl bg-gray-600 text-gray-400" :class="{'pop-animation': moneyPopAnimation}">
          §
          <span class="text-white">{{
            Math.floor(animatedMoney.value)
          }}</span>
        </p>
      </div>
    </div>

    <!-- mining progress bar -->
    <div
      class="
        opacity-0
        transition-opacity
        duration-300
        absolute
        top-[50%]
        left-[50%]
        translate-x-[-50%] translate-y-[-50%]
      "
      :class="{ 'opacity-50': miningPercent > 0 }"
    >
      <circle-progress
        :percent="miningPercent"
        class="m-auto"
        empty-color="transparent"
        fill-color="white"
        :border-width="4"
        :size="120"
        :transition="0"
      />
    </div>

    <!-- bottom -->
    <div class="w-full px-1.5">
      <!-- Messages -->
      <div class="w-full flex justify-center items-center">

        <transition>
            <p
            v-show="
              GameStateService.canLand.value && !GameStateService.landed.value
            "
            class="
              bg-gray-600
              text-gray-400
              uppercase
              px-3
              py-1
              text-xs
              font-bold
            "
          >
            Press <span class="text-white">Space</span> to land
          </p>
          </transition>

        <transition>
          <p
            v-show="
              minedChunksMessage
            "
            class="
              text-gray-300
              uppercase
              px-3
              py-1
              text-xs
              font-bold
            "
          >
            You mined 1 matter chunk
          </p>
        </transition>
      </div>

      <div class="w-full flex justify-between items-end h-16 pb-1">
        <div class="w-3/12">
            <div class="py-1 px-2 w-fit bg-gray-400 font-bold text-sm" :class="{'jump-animation': minedChunksMessage}">
                {{ GameStateService.minedMatter.value }}/{{GameStateService.minedMatterLimit.value}}
            </div>
        </div>
        <div class="w-6/12 flex justify-center items-center gap-2">

          <!-- Matter -->
          <div
            class="
              bg-cargo-matter
              flex flex-col
              justify-center
              items-center
              w-16
              py-1
              relative
              group
            "
            :class="{'jump-animation': gainedMatter}"
          >
            <p
                class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
                :class="{'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.matter > 0}"
            >§ {{matterSellingPrice}}</p>
            <div class="
                absolute top-0 left-0
                w-full h-full
                bg-black border-2
                opacity-0 hover:opacity-100 transition-all
                flex flex-col justify-center
                cursor-pointer
                group-active:bg-gray-800
            "
            @click="onSell(Cargo.Matter)"
            :class="{'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.matter > 0}"
            >
                <p class="font-bold text-center">
                {{ GameStateService.inventory.value.matter }}
                </p>
                <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p
                class="font-bold"
                :class="{'opacity-70': GameStateService.inventory.value.matter <= 0}"
            >
              {{ GameStateService.inventory.value.matter }}
            </p>
            <p class="text-xs uppercase">Matter</p>
          </div>

          <!-- Water -->
          <div
            class="
              bg-cargo-water
              flex flex-col
              justify-center
              items-center
              w-16
              py-1
              relative
              group
            "
          >
            <p
                class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
                :class="{'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.water > 0}"
            >§ {{waterSellingPrice}}</p>
            <div class="
                absolute top-0 left-0
                w-full h-full
                bg-black border-2
                opacity-0 hover:opacity-100 transition-all
                flex flex-col justify-center
                cursor-pointer
                group-active:bg-gray-800
            "
            @click="onSell(Cargo.Water)"
            :class="{'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.water > 0}"
            >
                <p class="font-bold text-center">
                {{ GameStateService.inventory.value.water }}
                </p>
                <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p
                class="font-bold"
                :class="{'opacity-70': GameStateService.inventory.value.water <= 0}"
            >
              {{ GameStateService.inventory.value.water }}
            </p>
            <p class="text-xs uppercase">Water</p>
          </div>

          <!-- Flora -->
          <div
            class="
              bg-cargo-flora
              flex flex-col
              justify-center
              items-center
              w-16
              py-1
              relative
              group
            "
          >
            <p
                class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
                :class="{'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.flora > 0}"
            >§ {{floraSellingPrice}}</p>
            <div class="
                absolute top-0 left-0
                w-full h-full
                bg-black border-2
                opacity-0 hover:opacity-100 transition-all
                flex flex-col justify-center
                cursor-pointer
                group-active:bg-gray-800
            "
            @click="onSell(Cargo.Flora)"
            :class="{'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.flora > 0}"
            >
                <p class="font-bold text-center">
                {{ GameStateService.inventory.value.flora }}
                </p>
                <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p
                class="font-bold"
                :class="{'opacity-70': GameStateService.inventory.value.flora <= 0}"
            >
              {{ GameStateService.inventory.value.flora }}
            </p>
            <p class="text-xs uppercase">Flora</p>
          </div>

          <!-- Minerals -->
          <div
            class="
              bg-cargo-minerals
              flex flex-col
              justify-center
              items-center
              w-16
              py-1
              relative
              group
            "
            v-if="GameStateService.hasUpgrade('cargo_minerals')"
          >
            <p
                class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
                :class="{'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.minerals > 0}"
            >§ {{mineralsSellingPrice}}</p>
            <div class="
                absolute top-0 left-0
                w-full h-full
                bg-black border-2
                opacity-0 hover:opacity-100 transition-all
                flex flex-col justify-center
                cursor-pointer
                group-active:bg-gray-800
            "
            @click="onSell(Cargo.Minerals)"
            :class="{'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.minerals > 0}"
            >
                <p class="font-bold text-center">
                {{ GameStateService.inventory.value.minerals }}
                </p>
                <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p
                class="font-bold"
                :class="{'opacity-70': GameStateService.inventory.value.minerals <= 0}"
            >
              {{ GameStateService.inventory.value.minerals }}
            </p>
            <p class="text-xs uppercase">Minerals</p>
          </div>

          <!-- Fungi -->
          <div
            class="
              bg-cargo-fungi
              flex flex-col
              justify-center
              items-center
              w-16
              py-1
              relative
              group
            "
            v-if="GameStateService.hasUpgrade('cargo_fungi')"
          >
            <p
                class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
                :class="{'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.fungi > 0}"
            >§ {{fungiSellingPrice}}</p>
            <div class="
                absolute top-0 left-0
                w-full h-full
                bg-black border-2
                opacity-0 hover:opacity-100 transition-all
                flex flex-col justify-center
                cursor-pointer
                group-active:bg-gray-800
            "
            @click="onSell(Cargo.Fungi)"
            :class="{'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.fungi > 0}"
            >
                <p class="font-bold text-center">
                {{ GameStateService.inventory.value.fungi }}
                </p>
                <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p
                class="font-bold"
                :class="{'opacity-70': GameStateService.inventory.value.fungi <= 0}"
            >
              {{ GameStateService.inventory.value.fungi }}
            </p>
            <p class="text-xs uppercase">Fungi</p>
          </div>

          <!-- Fauna -->
          <div
            class="
              bg-cargo-fauna
              flex flex-col
              justify-center
              items-center
              w-16
              py-1
              relative
              group
            "
            v-if="GameStateService.hasUpgrade('cargo_fauna')"
          >
            <p
                class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
                :class="{'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.fauna > 0}"
            >§ {{faunaSellingPrice}}</p>
            <div class="
                absolute top-0 left-0
                w-full h-full
                bg-black border-2
                opacity-0 hover:opacity-100 transition-all
                flex flex-col justify-center
                cursor-pointer
                group-active:bg-gray-800
            "
            @click="onSell(Cargo.Fauna)"
            :class="{'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.fauna > 0}"
            >
                <p class="font-bold text-center">
                {{ GameStateService.inventory.value.fauna }}
                </p>
                <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p
                class="font-bold"
                :class="{'opacity-70': GameStateService.inventory.value.fauna <= 0}"
            >
              {{ GameStateService.inventory.value.fauna }}
            </p>
            <p class="text-xs uppercase">Fauna</p>
          </div>

          <!-- Energy -->
          <div
            class="
              bg-cargo-energy
              flex flex-col
              justify-center
              items-center
              w-16
              py-1
              relative
              group
            "
            v-if="GameStateService.hasUpgrade('cargo_energy')"
          >
            <p
                class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
                :class="{'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.energy > 0}"
            >§ {{energySellingPrice}}</p>
            <div class="
                absolute top-0 left-0
                w-full h-full
                bg-black border-2
                opacity-0 hover:opacity-100 transition-all
                flex flex-col justify-center
                cursor-pointer
                group-active:bg-gray-800
            "
            @click="onSell(Cargo.Energy)"
            :class="{'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.energy > 0}"
            >
                <p class="font-bold text-center">
                {{ GameStateService.inventory.value.energy }}
                </p>
                <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p
                class="font-bold"
                :class="{'opacity-70': GameStateService.inventory.value.energy <= 0}"
            >
              {{ GameStateService.inventory.value.energy }}
            </p>
            <p class="text-xs uppercase">Energy</p>
          </div>

          <!-- Technology -->
          <div
            class="
              bg-cargo-technology
              flex flex-col
              justify-center
              items-center
              w-16
              py-1
              relative
              group
            "
            v-if="GameStateService.hasUpgrade('cargo_technology')"
          >
            <p
                class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
                :class="{'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.technology > 0}"
            >§ {{technologySellingPrice}}</p>
            <div class="
                absolute top-0 left-0
                w-full h-full
                bg-black border-2
                opacity-0 hover:opacity-100 transition-all
                flex flex-col justify-center
                cursor-pointer
                group-active:bg-gray-800
            "
            @click="onSell(Cargo.Technology)"
            :class="{'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.technology > 0}"
            >
                <p class="font-bold text-center">
                {{ GameStateService.inventory.value.technology }}
                </p>
                <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p
                class="font-bold"
                :class="{'opacity-70': GameStateService.inventory.value.technology <= 0}"
            >
              {{ GameStateService.inventory.value.technology }}
            </p>
            <p class="text-xs uppercase">Tech</p>
          </div>

          <!-- Weaponry -->
          <div
            class="
              bg-cargo-weaponry
              flex flex-col
              justify-center
              items-center
              w-16
              py-1
              relative
              group
            "
            v-if="GameStateService.hasUpgrade('cargo_weaponry')"
          >
            <p
                class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
                :class="{'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.weaponry > 0}"
            >§ {{weaponrySellingPrice}}</p>
            <div class="
                absolute top-0 left-0
                w-full h-full
                bg-black border-2
                opacity-0 hover:opacity-100 transition-all
                flex flex-col justify-center
                cursor-pointer
                group-active:bg-gray-800
            "
            @click="onSell(Cargo.Weaponry)"
            :class="{'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.weaponry > 0}"
            >
                <p class="font-bold text-center">
                {{ GameStateService.inventory.value.weaponry }}
                </p>
                <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p
                class="font-bold"
                :class="{'opacity-70': GameStateService.inventory.value.weaponry <= 0}"
            >
              {{ GameStateService.inventory.value.weaponry }}
            </p>
            <p class="text-xs uppercase">Weaponry</p>
          </div>

          <!-- Wisdom -->
          <div
            class="
              bg-cargo-wisdom
              flex flex-col
              justify-center
              items-center
              w-16
              py-1
              relative
              group
            "
            v-if="GameStateService.hasUpgrade('cargo_wisdom')"
          >
            <p
                class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
                :class="{'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.wisdom > 0}"
            >§ {{wisdomSellingPrice}}</p>
            <div class="
                absolute top-0 left-0
                w-full h-full
                bg-black border-2
                opacity-0 hover:opacity-100 transition-all
                flex flex-col justify-center
                cursor-pointer
                group-active:bg-gray-800
            "
            @click="onSell(Cargo.Wisdom)"
            :class="{'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.wisdom > 0}"
            >
                <p class="font-bold text-center">
                {{ GameStateService.inventory.value.wisdom }}
                </p>
                <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p
                class="font-bold"
                :class="{'opacity-70': GameStateService.inventory.value.wisdom <= 0}"
            >
              {{ GameStateService.inventory.value.wisdom }}
            </p>
            <p class="text-xs uppercase">Wisdom</p>
          </div>

        </div>
        <div class="w-3/12" />
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

.jump-animation {
    animation: jump .3s ease;
}

.pop-animation {
    animation: pop .3s ease;
}

.flash-animation {
  animation: flash .5s ease;
}

@keyframes jump {
    0%{transform: translateY(0)}
    50%{transform: translateY(-10px)}
    100%{transform: translateY(0)}
}

@keyframes pop {
    0%{transform: scale(1)}
    33%{transform: scale(1.1)}
    100%{transform: scale(1)}
}

@keyframes flash {
    0%{background-color: auto;}
    33%{background-color: white;}
    100%{background-color: auto;}
}
</style>
