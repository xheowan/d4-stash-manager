<script setup lang="ts">
import { useItemQuality } from '~/composables/item';

const props = defineProps<{
    modelValue: number[]
}>();

const { modelValue } = toRefs(props);
const emit = defineEmits(['update:modelValue']);

const {
    qualityList: qualityOptions,
    validateQualityData
} = useItemQuality();

const proxyModel = computed({
    get: () => modelValue.value.map(m => m.toString()),
    set: (data: string[]) => {
        emit('update:modelValue', data.map(Number));
    }
});


</script>

<template>
    <CtrlToogleButton
        v-slot="{ text }"
        v-model="proxyModel"
        :options="qualityOptions"
        :process="validateQualityData"
    >
        {{ $t(`item_quality.${text.toLocaleLowerCase()}`) }}
    </CtrlToogleButton>
</template>