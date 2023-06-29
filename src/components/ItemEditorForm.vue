<script setup lang="ts">
import { groupBy } from 'lodash-es';
import { ItemCategory, ItemType, ItemQuality, type IItem } from '~/stores';
import { convertEnumToOptions } from '~/utils';

interface Props {
    model?: IItem
}

const props = withDefaults(defineProps<Props>(), {
    model: undefined
});

const emit = defineEmits(['submit']);


// model
const { model } = toRefs(props);
const isLoading = ref(false);

// item level
const maxItemUpgradeLevel = computed(() => 5);

// item type
const itemCategoryList = convertEnumToOptions(ItemCategory);
const itemTypeGroupList = groupBy(convertEnumToOptions(ItemType), (option) => {
    const cate = (Math.floor(Number(option.value) / 100) % 10) * 100;
    return itemCategoryList.find(f => f.value === cate.toString())?.text;
});

// item quality 
const itemQualityList = convertEnumToOptions(ItemQuality);
const qualityGroup1 = [ItemQuality.Common, ItemQuality.Magic, ItemQuality.Rare, ItemQuality.Legendary, ItemQuality.Unique];
const qualityGroup2 = [ItemQuality.Sacred, ItemQuality.Ancestral];
const ItemQualityProcess = (value: string[]) => {
    const a = value.filter(val => qualityGroup1.includes(val as ItemQuality));
    const b = value.filter(val => qualityGroup2.includes(val as ItemQuality));

    if (a.length == 2)
        a.shift();
    if (b.length == 2)
        b.shift();
    
    return [...a, ...b];
}

const submit = () => {
    console.log('go submit');
    emit('submit');
}
</script>

<template>
    <div class="item-editor">
        <form v-if="model" v-submit="submit" class="needs-validation" novalidate>
            <input v-model="model.id" type="hidden" />

            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_name') }}</label>
                <input v-model="model.name" type="text" class="form-control" :placeholder="$t('form.item_name_placeholder')" required />
                <div class="invalid-feedback">{{ $t('form.item_name_invalid') }}</div>
            </div>

            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_quality') }}</label>
                <CtrlToogleButton v-model="model.quality" :options="itemQualityList" :process="ItemQualityProcess" />
            </div>

            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_type') }}</label>
                <select v-model="model.type" class="form-select" required>
                    <option :value="undefined">{{ $t('form.item_type_select_prompt') }}</option>
                    <optgroup v-for="(group, key) in itemTypeGroupList" :key="key" :label="$t(`item_category.${key.toString().toLocaleLowerCase()}`)">
                        <option v-for="option in group" :key="option.value">{{ $t(`item_type.${option.text.toLocaleLowerCase()}`) }}</option>
                    </optgroup>
                </select>
            </div>

            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_power') }}</label>
                <input v-model="model.itemPower" type="number" class="form-control" min="1" max="850" />
            </div>

            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_required_level') }}</label>
                <input v-model="model.requiredLevel" type="number" class="form-control" min="1" max="100" />
            </div>

            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_upgrade') }}</label>
                <input v-model="model.upgrade" type="number" class="form-control" min="0" :max="maxItemUpgradeLevel" />
            </div>

            <button type="submit" class="btn btn-primary" :disabled="isLoading">{{ $t('form.text_save') }}</button>
        </form>
    </div>
</template>