<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import gsap from 'gsap';
import GameStateService from "../../game/services/GameStateService";

const animatedMoney: Ref<any> = ref({ value: GameStateService.inventory.value.money });
watch(() => GameStateService.inventory.value.money, (currentMoney) => {
  gsap.to(animatedMoney.value, { value: currentMoney, duration: .5 });
});
</script>

<template>
    <p class="px-2 font-bold text-lgl bg-gray-600 text-gray-400"
    :class="{ 'pop-animation': GameStateService.moneyPopAnimation.value }">
        §
        <span class="text-white">{{
            Math.floor(animatedMoney.value)
        }}</span>
    </p>
</template>