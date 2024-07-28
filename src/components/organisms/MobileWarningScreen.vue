<script setup lang="ts">import { Ref, ref } from 'vue';
    const ignored: Ref<boolean> = ref(false);
</script>
<template>
    <Transition>
    <div
        v-show="!ignored"
        class="absolute z-50 top-0 left-0 w-full h-full bg-black flex justify-center flex-col items-center opacity-100 landscape:opacity-0 landscape:pointer-events-none transition-opacity duration-300 gap-2">

        <div class="text-white text-7xl mt-6 flex justify-between gap-5">
            <i class="fa-solid fa-keyboard w-4/12" />
            <p class="w-4/12">+</p>
            <i class="fa-solid fa-computer-mouse w-4/12" />
        </div>

        <p class="text-white font-bold text-3xl mt-10">Play on desktop!</p>
        <p class="text-white text-sm w-10/12 sm:w-9/12 text-center mt-10">We recommend you play this game on a desktop
            computer.</p>
        <p class="text-white text-sm w-10/12 sm:w-9/12 text-center">You will need a keyboard and mouse to pilot your
            spaceship, and a wide screen <span class="text-gray-500">(landscape ratio)</span> for optimal stargazing.</p>

        <button @click="ignored = true" class="
            border-2
            border-white
            text-white
            uppercase sm:text-lg font-bold
            px-2 py-1 transition-colors
            mt-10 hover:bg-white hover:text-black
            cursor-pointer
            ">
            Ignore
        </button>
    </div>
</Transition>
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