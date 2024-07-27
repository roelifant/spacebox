<script setup lang="ts">
import { watch, Ref, ref } from "@vue/runtime-core";
import LoadUIService from "../../game/services/LoadUIService";

const ready: Ref<boolean> = ref(false);
const progress: Ref<number> = ref(0);

watch(() => LoadUIService.progress.value, () => {
    progress.value = LoadUIService.progress.value;
    if(LoadUIService.progress.value == 100){
        ready.value = true;
    }
});
    
</script>

<template>
    <div
        class="
            absolute top-0 left-0 z-50
            w-full h-full
            pointer-events-none
            text-white bg-black
            transition-opacity duration-700
            flex items-center justify-center
        "
        :class="{'opacity-0': ready}"
    >
        <div class="border-2 border-white w-6/12 h-6 p-0.5">
            <div
                class="h-full bg-white transition-all duration-300"
                :class="'w-['+progress+'%]'"
            />
        </div>
    </div>
</template>