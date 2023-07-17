<script setup lang="ts">
import type { OptionItem } from '~/utils';

interface Props {
    options: OptionItem[],
    modelValue: string[],
    max?: number,
    process?: (value: string[]) => string[],
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    options: () => [],
    modelValue: () => [],
    max: undefined,
    process: undefined,
    disabled: false
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
                :disabled="disabled"
            />
            <label class="btn btn-sm btn-outline-primary me-2 mb-md-0 mb-2" :for="getElementId(item.text)">
                <slot :text="item.text" :value="item.value" />
            </label>
        </template>
    </div>
</template>