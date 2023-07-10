<script setup lang="ts">
import { ItemType } from '~/stores';
import { useItemType } from '~/composables/item';
import { toSnakeCase } from '~/utils';

const props = withDefaults(defineProps<{
    modelValue?: ItemType,
    filter?: string[]
}>(), {
    modelValue: undefined,
    filter: undefined
});
const emit = defineEmits(['update:modelValue']);

const { filter } = toRefs(props);


const { groupTypeList } = useItemType(filter);

const proxyValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    },
});

</script>

<template>
    <select v-bind="$attrs" v-model.number="proxyValue">
        <option :value="undefined">{{ $t('form.item_type_select_prompt') }}</option>
        <optgroup v-for="(group, key) in groupTypeList" :key="key" :label="$t(`item_category.${toSnakeCase(key as string)}`)">
            <option v-for="option in group" :key="option.value" :value="option.value">{{ option.text }}</option>
        </optgroup>
    </select>
</template>