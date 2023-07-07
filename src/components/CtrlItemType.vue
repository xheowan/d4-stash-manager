<script setup lang="ts">
import { ItemType } from '~/stores';
import { useItemType } from '~/composables/item';
import { toSnakeCase } from '~/utils';

const props = defineProps<{
    modelValue?: ItemType
}>();

const emit = defineEmits(['update:modelValue']);

const { groupTypeList } = useItemType();
const proxyValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit("update:modelValue", value);
    },
});

</script>

<template>
    <!--:value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"-->
    <select v-bind="$attrs" v-model="proxyValue">
        <option :value="undefined">{{ $t('form.item_type_select_prompt') }}</option>
        <optgroup v-for="(group, key) in groupTypeList" :key="key" :label="$t(`item_category.${toSnakeCase(key as string)}`)">
            <option v-for="option in group" :key="option.value" :value="option.value">{{ $t(`item_type.${toSnakeCase(option.text)}`) }}</option>
        </optgroup>
        <!-- <optgroup v-for="(group, key) in itemTypeGroupList" :key="key" :label="$t(`item_category.${key.toString().toLocaleLowerCase()}`)">
            <option v-for="option in group" :key="option.value" :value="option.value">{{ $t(`item_type.${option.text.toLocaleLowerCase()}`) }}</option>
        </optgroup> -->
    </select>
</template>