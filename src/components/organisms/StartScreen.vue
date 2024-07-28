<script setup lang="ts">
import SaveSlot from '../molecules/SaveSlot.vue';

const emit = defineEmits<{
    (e: 'start', slot: string): void
}>();

const onStart = (slot: string) => {
    emit('start', slot);
};
</script>

<template>
    <div
        class="
        w-full h-full
        absolute top-0 left-0
        bg-black text-white
        z-50
        flex flex-col justify-center items-center
        px-20
    ">
    <div
        class="
            flex flex-col justify-center
            w-72
        "
    >
        <p class="text-3xl uppercase font-bold text-center">Spacebox</p>

        <div class="mt-10 flex flex-col gap-4">
            <SaveSlot name="Save 1" save="slot1" @load="onStart($event)"/>

            <SaveSlot name="Save 2" save="slot2" @load="onStart($event)"/>

            <SaveSlot name="Save 3" save="slot3" @load="onStart($event)"/>
        </div>

        <p class="text-center text-sm text-gray-400 mt-10">
            created by <a class="text-gray-200" href="https://roelifant.com">roelifant</a>
        </p>
    </div>
        
    </div>
</template>