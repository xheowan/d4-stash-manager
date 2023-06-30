<script setup lang="ts">
import { initAttrModel } from '~/composables/statsh';
import { IItemAttribute, ItemAttributeType, ItemType } from '~/stores';

import dataAffixes from '~/data/affixes.json';
import { convertEnumToOptions } from '~/utils';
import { clone } from 'lodash-es';

// type DataAffix = {
//     id: string,
//     title: string,
//     range: string,
//     powerIncrease: Record<string, number[]>,
//     requiredItemType: string[]
// } | undefined

// init props & emits
interface Props {
    modelValue: IItemAttribute[],
    itemType?: ItemType,
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    itemType: undefined
});

const { itemType, modelValue } = toRefs(props);

const model = ref<IItemAttribute>(initAttrModel());

const selectedAffix = computed({
    get: () => model.value.id ? dataAffixes.find(f => f.id == model.value.id) : undefined,
    set: (value) => {
        model.value.id = value?.id || undefined;
        return value;
    }
});

// attibute list (filtered data affixes)
const itemAttrList = computed(() => {
    const type = itemType.value ? ItemType[itemType.value] : null;

    return dataAffixes
        .filter(f => !type || f.requiredItemType.includes(type.toLocaleLowerCase()));
});

// attribute type
const attributeTypeList = convertEnumToOptions(ItemAttributeType);
const selectedAttrType = computed({
    get: () => [model.value.type.toString()],
    set: (value) => {
        model.value.type = Number(value[0]);
    }
});

// attribute value
const inputAttrValues = ref<string>(model.value.values?.join(','));

const add = () => {
    if (!model.value || !model.value.type || !model.value.values)
        return;

    // clear data
    model.value.values = inputAttrValues.value.split(',').map(Number);

    // check exists
    const aidx = modelValue.value.findIndex(f => f.id == model.value.id);
    if (aidx != -1) {
        modelValue.value[aidx] = clone(model.value);
    } else {
        model.value.rank = modelValue.value.length;
        modelValue.value.push(clone(model.value));
    }

    model.value = initAttrModel();
    inputAttrValues.value = '';
}

</script>

<template>
    <div class="bg-light p-3">
        <div class="row g-3">
            <div class="col-8">
                <CtrlToogleButton 
                    v-slot="{ text }"
                    v-model="selectedAttrType"
                    :options="attributeTypeList"
                    :max="1"
                    :disabled="!itemType"
                >
                    {{ $t(`item_attribute_type.${text.toLocaleLowerCase()}`) }}
                </CtrlToogleButton>
            </div>
            <div class="col-8">
                <select v-model="selectedAffix" :disabled="!itemType" class="form-select">
                    <option :value="undefined">{{ $t('form.item_attribute_select_prompt') }}</option>
                    <option v-for="attr in itemAttrList" :key="attr.id" :value="attr">{{ $t(`item_attributes.${attr.id}`, ['n']) }}</option>
                </select>
            </div>
            <div class="col-4">
                <input v-model="inputAttrValues" type="text" class="form-control" :placeholder="selectedAffix?.range || $t('form.item_affix_range')" />
            </div>
        </div>

        <button type="button" class="btn btn-sm btn-secondary mt-2" :disabled="!itemType || !model.id" @click="add">{{ $t('ui.create') }}</button>
    </div>
</template>