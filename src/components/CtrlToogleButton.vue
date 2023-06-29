<script setup lang="ts">
import type { OptionItem } from '~/utils';

interface Props {
    options: OptionItem[],
    modelValue: string[],
    max?: number,
    process?: (value: string[]) => string[]
}

const props = withDefaults(defineProps<Props>(), {
    options: () => [],
    modelValue: () => [],
    max: undefined,
    process: undefined
});

const { modelValue } = toRefs(props);

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
    get: () => modelValue.value,
    set: (value) => {
        if (value && typeof props.max === 'number' && value.length > props.max) {
            value.shift();
        }

        props.process && (value = props.process(value));

        emit('update:modelValue', value);    
    }
});

const getElementId = (name: string) => `btn-quality-${name.toLocaleLowerCase()}`;
</script>

<template>
    <div class="toggle-btn-list">
        <template v-for="item in options" :key="item.value">
            <input 
                :id="getElementId(item.text)" 
                v-model="inputValue"
                type="checkbox" 
                class="btn-check" 
                autocomplete="off"
                :value="item.value" 
            />
            <label class="btn btn-sm btn-outline-primary me-2" :for="getElementId(item.text)">{{ $t(`item_quality.${item.text.toLocaleLowerCase()}`) }}</label>
        </template>
    </div>
</template>