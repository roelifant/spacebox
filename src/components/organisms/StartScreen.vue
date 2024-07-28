<script setup lang="ts">
import Button from '../atoms/Button.vue';

const emit = defineEmits<{
    (e: 'start', slot: string): void
}>();

const onStart = () => {
    emit('start', 'default');
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
            w-40
        "
    >
        <p class="text-3xl uppercase font-bold text-center">Spacebox</p>
        <Button @click="onStart">
            Start
        </Button>
    </div>
        
    </div>
</template>