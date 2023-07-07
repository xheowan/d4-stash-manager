<script setup lang="ts">
import { createI18nAffixes } from '~/composables/affix';
import { initAttrModel } from '~/composables/stash';
import { IItemAttribute, ItemAttributeType, ItemType } from '~/stores';
import { convertEnumToOptions, clone, toSnakeCase } from '~/utils';

// init props & emits
const props = withDefaults(defineProps<{
    modelValue: IItemAttribute[],
    itemType?: ItemType,
}>(), {
    modelValue: () => [],
    itemType: undefined
});
// const emit = defineEmits(['update:modelValue']);

const { itemType, modelValue } = toRefs(props);

// affix data list
const dataAffixes = createI18nAffixes();
// attribute model
const editIdx = ref<number>(-1);
const model = ref<IItemAttribute>(initAttrModel());
const resetModel = () => {
    editIdx.value = -1;
    model.value = initAttrModel();
    keyword.value = '';
}
// proxy select affix model
const proxyAffixModel = computed({
    get: () => model.value.id ? dataAffixes.find(f => f.id == model.value.id) : undefined,
    set: (value) => {
        model.value.id = value?.id || undefined;
    }
});


// search data affix list
const keyword = ref<string>('');
// watchDebounced(keyword, () => {
//     if (editIdx.value == -1)
//         model.value.id = undefined;
// }, { debounce: 500 });
// attibute list (filtered data affixes)
const filterAffixList = computed(() => {
    // item type
    let type = itemType.value ? ItemType[itemType.value].toLowerCase() : null;

    if (type?.includes('aspect')) {
        type = type.replace('aspect', '');
    }

    let query = dataAffixes;

    if (type) {
        query = query.filter(f => f.requiredItemType.includes(type as string) || f.tags.includes(type as string));
    }

    if (keyword.value) {
        query = query.filter(f => f.title.includes(keyword.value));
    }

    return query.sort((a, b) => a.title.localeCompare(b.title));
});


// attribute type
const typeOptions = convertEnumToOptions(ItemAttributeType);
// proxy for model.type
// const proxyTypeModel = computed({
//     get: () => [model.value.type.toString()],
//     set: (value) => {
//         model.value.type = Number(value[0]);
//     }
// });

// attribute value
const inputAttrValues = computed({
    get: () => model.value.values?.join(','),
    set: (value) => {
        model.value.values = value.split(',').map(Number);
    }
});

// need editIdx to detect create or update

const save = () => {
    if (!model.value || !model.value.type || !model.value.values)
        return;

    if (editIdx.value != -1) {
        // update
        console.log('update');
        modelValue.value[editIdx.value] = clone(model.value);
    } else {
        // create
        model.value.rank = modelValue.value.length;
        modelValue.value.push(clone(model.value));
    }

    resetModel();
}

const modify = (item: IItemAttribute) => {
    editIdx.value = modelValue.value.findIndex(f => f.id == item.id);
    model.value = clone(item);
}

const remove = (item: IItemAttribute) => {
    const idx = modelValue.value.findIndex(f => f.id == item.id);
    modelValue.value.splice(idx, 1);
    resetModel();
}

</script>

<template>
    <ItemAffixView
        class="mb-2"
        :data="modelValue"
        :edit="true"
        @update="modify"
        @remove="remove"
    />
    <div class="bg-light p-3">
        <div class="row g-3">
            <div class="col-md-5 order-md-first">
                <input v-model="keyword" type="text" class="form-control" :placeholder="$t('form.item_attribute_keyword')" :disabled="!itemType || editIdx !== -1" />
            </div>
            <div class="col-md-7 order-first">
                <template v-for="option in typeOptions" :key="option.id">
                    <input :id="`radio-type-${option.value}`" v-model.number="model.type" :value="option.value" type="radio" class="btn-check" autocomplete="off">
                    <label class="btn btn-sm btn-outline-primary me-2" :for="`radio-type-${option.value}`">{{ $t(`item_attribute_type.${toSnakeCase(option.text)}`) }}</label>
                </template>
                <!-- <CtrlToogleButton 
                    v-slot="{ text }"
                    v-model="proxyTypeModel"
                    :options="typeOptions"
                    :max="1"
                    :disabled="!itemType"
                >
                    {{ $t(`item_attribute_type.${toSnakeCase(text)}`) }}
                </CtrlToogleButton> -->
            </div>

            <div class="col-md-8">
                <select v-model="proxyAffixModel" class="form-select" :disabled="!itemType || editIdx !== -1">
                    <option :value="undefined">{{ $t('form.item_attribute_select_prompt') }}</option>
                    <option v-for="attr in filterAffixList" :key="attr.id" :value="attr">{{ attr.title }}</option>
                </select>
            </div>
            <div class="col-md-4">
                <input v-model.lazy="inputAttrValues" type="text" class="form-control" :placeholder="proxyAffixModel?.valueRange.join(',') || $t('form.item_affix_range')" />
            </div>
        </div>

        <div class="mt-2">
            <button type="button" class="btn btn-sm btn-secondary" :disabled="!itemType || !model.id" @click="save">{{ $t(editIdx != -1 ? 'ui.update' : 'ui.create') }}</button>
        </div>
    </div>
</template>