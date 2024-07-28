<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { Save } from '../../game/objects/Save';
import Button from '../atoms/Button.vue';

    const props = defineProps<{
        name: string;
        save: string;
    }>();

    const emit = defineEmits<{
        (e: 'load', slot: string): void
    }>();

    const save: Ref<Save|undefined> = ref();
    const newSave = ref(true);
    const progress = ref(0);

    const onDelete = () => {
        save.value?.clear();
        newSave.value = true;
    }

    onMounted(() => {
        save.value = new Save(props.save);

        console.log(props.save);

        if(!!save.value.data) {
            newSave.value = false;
            progress.value = save.value.data?.progress;
        }
    })
</script>

<template>
    <div class="
        w-full h-20
        border-2 border-white
        text-white
        p-4
        hover:bg-gray-900 hover:cursor-pointer
        transition-colors
        flex flex-col justify-center
    " @click="$emit('load', props.save)">
        <div v-if="!newSave" class="flex justify-between items-center">
            <div>
                <p class="font-bold uppercase">{{name}}</p>
                <p>{{progress}} %</p>
            </div>

            <Button class="hover:bg-red-500 hover:border-red-500" @click.stop="onDelete()">
                Delete
            </Button>
            
        </div>
        <div v-else>
            <p class="font-bold uppercase text-center"> New Save </p>
        </div>
    </div>
</template>