<script setup lang="ts">
    import { computed, ComputedRef, Ref, ref, watch } from "vue";
    import GameStateService from "../../game/services/GameStateService";
    import Market from '../../game/services/Market';
    import { Cargo } from '../../game/enums/Cargo';
    import PlanetUIService from '../../game/services/PlanetUIService';

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
        if (PlanetUIService.shown.value) {
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
    });

    const onSell = (cargo: Cargo) => {
        Market.sell(cargo);
        GameStateService.moneyPopAnimation.value = true;
        setTimeout(() => GameStateService.moneyPopAnimation.value = false, 300);
    }
</script>

<template>
    <!-- Matter -->
    <div class="
                bg-cargo-matter
                flex flex-col
                justify-center
                items-center
                w-16
                py-1
                relative
                group
              " :class="{ 'jump-animation': GameStateService.gainedMatter.value }">
            <p class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
              :class="{ 'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.matter > 0 }">
              § {{ matterSellingPrice }}</p>
            <div class="
                  absolute top-0 left-0
                  w-full h-full
                  bg-black border-2
                  opacity-0 hover:opacity-100 transition-all
                  flex flex-col justify-center
                  cursor-pointer
                  group-active:bg-gray-800
              " @click="onSell(Cargo.Matter)"
              :class="{ 'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.matter > 0 }">
              <p class="font-bold text-center">
                {{ GameStateService.inventory.value.matter }}
              </p>
              <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p class="font-bold" :class="{ 'opacity-70': GameStateService.inventory.value.matter <= 0 }">
              {{ GameStateService.inventory.value.matter }}
            </p>
            <p class="text-xs uppercase">Matter</p>
          </div>

          <!-- Water -->
          <div class="
                bg-cargo-water
                flex flex-col
                justify-center
                items-center
                w-16
                py-1
                relative
                group
              ">
            <p class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
              :class="{ 'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.water > 0 }">
              § {{ waterSellingPrice }}</p>
            <div class="
                  absolute top-0 left-0
                  w-full h-full
                  bg-black border-2
                  opacity-0 hover:opacity-100 transition-all
                  flex flex-col justify-center
                  cursor-pointer
                  group-active:bg-gray-800
              " @click="onSell(Cargo.Water)"
              :class="{ 'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.water > 0 }">
              <p class="font-bold text-center">
                {{ GameStateService.inventory.value.water }}
              </p>
              <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p class="font-bold" :class="{ 'opacity-70': GameStateService.inventory.value.water <= 0 }">
              {{ GameStateService.inventory.value.water }}
            </p>
            <p class="text-xs uppercase">Water</p>
          </div>

          <!-- Flora -->
          <div class="
                bg-cargo-flora
                flex flex-col
                justify-center
                items-center
                w-16
                py-1
                relative
                group
              ">
            <p class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
              :class="{ 'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.flora > 0 }">
              § {{ floraSellingPrice }}</p>
            <div class="
                  absolute top-0 left-0
                  w-full h-full
                  bg-black border-2
                  opacity-0 hover:opacity-100 transition-all
                  flex flex-col justify-center
                  cursor-pointer
                  group-active:bg-gray-800
              " @click="onSell(Cargo.Flora)"
              :class="{ 'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.flora > 0 }">
              <p class="font-bold text-center">
                {{ GameStateService.inventory.value.flora }}
              </p>
              <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p class="font-bold" :class="{ 'opacity-70': GameStateService.inventory.value.flora <= 0 }">
              {{ GameStateService.inventory.value.flora }}
            </p>
            <p class="text-xs uppercase">Flora</p>
          </div>

          <!-- Minerals -->
          <div class="
                bg-cargo-minerals
                flex flex-col
                justify-center
                items-center
                w-16
                py-1
                relative
                group
              " v-if="GameStateService.hasUpgrade('cargo_minerals')">
            <p class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
              :class="{ 'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.minerals > 0 }">
              § {{ mineralsSellingPrice }}</p>
            <div class="
                  absolute top-0 left-0
                  w-full h-full
                  bg-black border-2
                  opacity-0 hover:opacity-100 transition-all
                  flex flex-col justify-center
                  cursor-pointer
                  group-active:bg-gray-800
              " @click="onSell(Cargo.Minerals)"
              :class="{ 'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.minerals > 0 }">
              <p class="font-bold text-center">
                {{ GameStateService.inventory.value.minerals }}
              </p>
              <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p class="font-bold" :class="{ 'opacity-70': GameStateService.inventory.value.minerals <= 0 }">
              {{ GameStateService.inventory.value.minerals }}
            </p>
            <p class="text-xs uppercase">Minerals</p>
          </div>

          <!-- Fungi -->
          <div class="
                bg-cargo-fungi
                flex flex-col
                justify-center
                items-center
                w-16
                py-1
                relative
                group
              " v-if="GameStateService.hasUpgrade('cargo_fungi')">
            <p class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
              :class="{ 'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.fungi > 0 }">
              § {{ fungiSellingPrice }}</p>
            <div class="
                  absolute top-0 left-0
                  w-full h-full
                  bg-black border-2
                  opacity-0 hover:opacity-100 transition-all
                  flex flex-col justify-center
                  cursor-pointer
                  group-active:bg-gray-800
              " @click="onSell(Cargo.Fungi)"
              :class="{ 'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.fungi > 0 }">
              <p class="font-bold text-center">
                {{ GameStateService.inventory.value.fungi }}
              </p>
              <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p class="font-bold" :class="{ 'opacity-70': GameStateService.inventory.value.fungi <= 0 }">
              {{ GameStateService.inventory.value.fungi }}
            </p>
            <p class="text-xs uppercase">Fungi</p>
          </div>

          <!-- Fauna -->
          <div class="
                bg-cargo-fauna
                flex flex-col
                justify-center
                items-center
                w-16
                py-1
                relative
                group
              " v-if="GameStateService.hasUpgrade('cargo_fauna')">
            <p class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
              :class="{ 'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.fauna > 0 }">
              § {{ faunaSellingPrice }}</p>
            <div class="
                  absolute top-0 left-0
                  w-full h-full
                  bg-black border-2
                  opacity-0 hover:opacity-100 transition-all
                  flex flex-col justify-center
                  cursor-pointer
                  group-active:bg-gray-800
              " @click="onSell(Cargo.Fauna)"
              :class="{ 'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.fauna > 0 }">
              <p class="font-bold text-center">
                {{ GameStateService.inventory.value.fauna }}
              </p>
              <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p class="font-bold" :class="{ 'opacity-70': GameStateService.inventory.value.fauna <= 0 }">
              {{ GameStateService.inventory.value.fauna }}
            </p>
            <p class="text-xs uppercase">Fauna</p>
          </div>

          <!-- Energy -->
          <div class="
                bg-cargo-energy
                flex flex-col
                justify-center
                items-center
                w-16
                py-1
                relative
                group
              " v-if="GameStateService.hasUpgrade('cargo_energy')">
            <p class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
              :class="{ 'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.energy > 0 }">
              § {{ energySellingPrice }}</p>
            <div class="
                  absolute top-0 left-0
                  w-full h-full
                  bg-black border-2
                  opacity-0 hover:opacity-100 transition-all
                  flex flex-col justify-center
                  cursor-pointer
                  group-active:bg-gray-800
              " @click="onSell(Cargo.Energy)"
              :class="{ 'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.energy > 0 }">
              <p class="font-bold text-center">
                {{ GameStateService.inventory.value.energy }}
              </p>
              <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p class="font-bold" :class="{ 'opacity-70': GameStateService.inventory.value.energy <= 0 }">
              {{ GameStateService.inventory.value.energy }}
            </p>
            <p class="text-xs uppercase">Energy</p>
          </div>

          <!-- Technology -->
          <div class="
                bg-cargo-technology
                flex flex-col
                justify-center
                items-center
                w-16
                py-1
                relative
                group
              " v-if="GameStateService.hasUpgrade('cargo_technology')">
            <p class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
              :class="{ 'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.technology > 0 }">
              § {{ technologySellingPrice }}</p>
            <div class="
                  absolute top-0 left-0
                  w-full h-full
                  bg-black border-2
                  opacity-0 hover:opacity-100 transition-all
                  flex flex-col justify-center
                  cursor-pointer
                  group-active:bg-gray-800
              " @click="onSell(Cargo.Technology)"
              :class="{ 'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.technology > 0 }">
              <p class="font-bold text-center">
                {{ GameStateService.inventory.value.technology }}
              </p>
              <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p class="font-bold" :class="{ 'opacity-70': GameStateService.inventory.value.technology <= 0 }">
              {{ GameStateService.inventory.value.technology }}
            </p>
            <p class="text-xs uppercase">Tech</p>
          </div>

          <!-- Weaponry -->
          <div class="
                bg-cargo-weaponry
                flex flex-col
                justify-center
                items-center
                w-16
                py-1
                relative
                group
              " v-if="GameStateService.hasUpgrade('cargo_weaponry')">
            <p class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
              :class="{ 'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.weaponry > 0 }">
              § {{ weaponrySellingPrice }}</p>
            <div class="
                  absolute top-0 left-0
                  w-full h-full
                  bg-black border-2
                  opacity-0 hover:opacity-100 transition-all
                  flex flex-col justify-center
                  cursor-pointer
                  group-active:bg-gray-800
              " @click="onSell(Cargo.Weaponry)"
              :class="{ 'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.weaponry > 0 }">
              <p class="font-bold text-center">
                {{ GameStateService.inventory.value.weaponry }}
              </p>
              <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p class="font-bold" :class="{ 'opacity-70': GameStateService.inventory.value.weaponry <= 0 }">
              {{ GameStateService.inventory.value.weaponry }}
            </p>
            <p class="text-xs uppercase">Weaponry</p>
          </div>

          <!-- Wisdom -->
          <div class="
                bg-cargo-wisdom
                flex flex-col
                justify-center
                items-center
                w-16
                py-1
                relative
                group
              " v-if="GameStateService.hasUpgrade('cargo_wisdom')">
            <p class="text-center uppercase font-bold absolute -top-7 opacity-0 transition-opacity"
              :class="{ 'opacity-70 group-hover:opacity-100': PlanetUIService.shown.value && GameStateService.inventory.value.wisdom > 0 }">
              § {{ wisdomSellingPrice }}</p>
            <div class="
                  absolute top-0 left-0
                  w-full h-full
                  bg-black border-2
                  opacity-0 hover:opacity-100 transition-all
                  flex flex-col justify-center
                  cursor-pointer
                  group-active:bg-gray-800
              " @click="onSell(Cargo.Wisdom)"
              :class="{ 'pointer-events-auto': PlanetUIService.shown.value && GameStateService.inventory.value.wisdom > 0 }">
              <p class="font-bold text-center">
                {{ GameStateService.inventory.value.wisdom }}
              </p>
              <p class="text-center uppercase text-xs font-bold">sell</p>
            </div>
            <p class="font-bold" :class="{ 'opacity-70': GameStateService.inventory.value.wisdom <= 0 }">
              {{ GameStateService.inventory.value.wisdom }}
            </p>
            <p class="text-xs uppercase">Wisdom</p>
          </div>
</template>