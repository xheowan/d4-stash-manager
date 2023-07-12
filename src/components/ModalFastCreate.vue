<script setup lang="ts">
import type CtrlAffixSearch from './CtrlAffixSearch.vue';
import { DataAffix, findDuplicateItemTypes } from '~/composables/affix';
import { useItem, convertItemTypeToCategory } from '~/composables/item';

type SelectAffix = {
    [key: string]: DataAffix
}

const emit = defineEmits(['submit']);

const { t } = useI18n();

const step = ref(1);
const isLoading = ref(false);
const showMoreInput = ref(false);
const ctrlSearch = ref<InstanceType<typeof CtrlAffixSearch> | null>(null);


// item model
const {
    model,
    mainLegendaryAffix,
    toggleAffix,
    removeAffix,
    inputAffixValues
} = useItem();

const tempSelectedAffixes = ref<DataAffix[]>([]);

// const getAffix = (id: string) => tempSelectedAffixes.value.find(f => f.id == id);

watch(() => model.value.attributes, (data) => {
    if (data.length === 0) {
        tempSelectedAffixes.value = [];
        step.value = 1;
    } else {
        tempSelectedAffixes.value.forEach((item, idx) => {
            if (!data.find(f => f.id == item.id)) {
                data.splice(idx, 1);
            }
        });
    }
    
}, { deep: true });


const dicSelectedAffix = computed(() => {
    return tempSelectedAffixes.value.reduce((acc: SelectAffix, item) => {
        acc[item.id] = item;
        return acc;
    }, {});
});

const itemTypeFilter = computed(() => {
    if (mainLegendaryAffix.value) {
        return mainLegendaryAffix.value.requiredItemType;
    }

    return findDuplicateItemTypes(tempSelectedAffixes.value);
});

const defaultStashTab = ref(1);
watch(defaultStashTab, (nval) => {
    model.value.stashTab = nval;
});

// const nextStep = () => {
//     if (!model.value.attributes.length) {
//         alert(t('ui.prompt_select_at_least_one_affix'));
//         return;
//     }

//     step.value = 2;
// }

// model save
const continueCreate = ref(true);
const submit = () => {
    if (model.value.attributes.some(s => s.values.length === 0)) {
        alert(t('ui.prompt_affix_values_empty'));
        return;
    }

    emit('submit', model.value, continueCreate.value);
    model.value = initItemModel();
    mainLegendaryAffix.value = undefined;
    ctrlSearch.value?.reset();

    // reset
    if (continueCreate.value) {
        step.value = 1;
        model.value.stashTab = defaultStashTab.value;
    }
}

onUnmounted(() => {
    model.value = initItemModel();
    mainLegendaryAffix.value = undefined;
});

</script>

<template>
    <div class="modal-body item-fast-create">
        <!--step 1-->
        <template v-if="step === 1">
            <CtrlAffixSearch ref="ctrlSearch" v-model="tempSelectedAffixes" @select="({ item }) => toggleAffix(item)" />
        </template>
        <!--step 2-->
        <template v-else>
            <!--item attributes-->
            <div class="mb-3">
                <label class="form-label">{{ $t('form.item_attribute') }}</label>
                <div class="list-group">
                    <div 
                        v-for="(item, idx) in model.attributes" 
                        :key="item.id" 
                        class="list-group-item"
                    >
                        <div class="row">
                            <div class="col-9">
                                <label class="form-label" :for="`attr-item-${item.id}`">
                                    <ItemAffix :data="item" />
                                </label>
                                <small v-if="item.type !== ItemAttributeType.LegendaryAspect" class="text-body-secondary d-block">
                                    {{ dicSelectedAffix[item.id as string]?.itemTypeSlot?.map(m => $t(`item_type.${m}`)).join(', ') }}
                                </small>
                            </div>
                            <div class="col-3">
                                <input 
                                    :id="`attr-item-${item.id}`" 
                                    v-filter-number
                                    type="text" 
                                    class="form-control mb-2"
                                    :value="item.values.join(',')"
                                    :placeholder="$t('form.item_affix_range')"
                                    :tabindex="idx + 1"
                                    @input.prevent="inputAffixValues($event, item)"
                                />
                                <button type="button" class="btn btn-sm btn-outline-danger w-100" @click="removeAffix(item.id)">{{ $t('ui.remove') }}</button>
                            </div>
                        </div>
                    </div>
                    <div v-if="model.attributes.length === 0" class="list-group-item">
                        {{ $t('ui.no_attributes') }}
                    </div>
                </div>
            </div>

            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_power') }}</label>
                <input v-model="model.itemPower" v-input-select v-filter-number type="number" class="form-control" min="1" max="850" />
            </div>

            <!--item name-->
            <div class="mb-3">
                <label class="form-label">{{ $t('form.item_name') }}</label>
                <input v-model="model.name" type="text" class="form-control" /> 
            </div>

            <!--item quality-->
            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_quality') }}</label>
                <CtrlItemQuality v-model="model.quality" />
            </div>

            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_type') }}</label>
                <CtrlItemType v-model="model.type" class="form-select" :filter="itemTypeFilter" required />
            </div>

            <template v-if="showMoreInput">
                <div class="row mb-3">
                    <div class="col">
                        <label for="type" class="form-label">{{ $t('form.item_upgrade') }}</label>
                        <input v-model="model.upgrade" v-input-select v-filter-number type="number" class="form-control" min="0" :max="5" :disabled="convertItemTypeToCategory(model.type || 0) === ItemCategory.LegendaryAspects" />
                    </div>
                    <div class="col">
                        <label for="type" class="form-label">{{ $t('form.item_required_level') }}</label>
                        <input v-model="model.requiredLevel" v-input-select v-filter-number type="number" class="form-control" min="1" max="100" />
                    </div>
                </div>

                <div class="mb-3">
                    <label for="type" class="form-label">{{ $t('form.item_stash_tab') }}</label>
                    <input v-model.number="model.stashTab" v-input-select v-filter-number type="number" class="form-control" min="1" />
                </div>
            </template>
        </template>
    </div>
    <div class="modal-footer justify-content-between">
        <template v-if="step === 1">
            <div class="col text-start">
                <div class="row g-3 align-items-center">
                    <div class="col-auto">
                        <label for="stash-tab-number" class="col-form-label">{{ $t('form.item_stash_tab') }}</label>
                    </div>
                    <div class="col-3">
                        <input id="stash-tab-number" v-model="defaultStashTab" v-input-select v-filter-number class="form-control form-control-sm" type="text" />
                    </div>
                </div>
            </div>
            <div class="col text-end">
                <button type="button" class="btn btn-outline-primary" :disabled="!model.attributes.length" @click="step = 2">{{ $t('ui.next_step') }}</button>
            </div>
        </template>
        <template v-else>
            <!-- prev step and save button-->
            <div class="col text-start">
                <button type="button" class="btn btn-outline-secondary me-2" @click="step = 1">{{ $t('ui.prev_step') }}</button>
                <button type="button" class="btn btn-outline-secondary" @click="showMoreInput = !showMoreInput">{{ $t(`ui.${showMoreInput ? 'hide' : 'show'}_other`) }}</button>
            </div>
            <div class="col text-end">
                <div class="form-check form-check-inline">
                    <input id="check-continue-create" v-model="continueCreate" class="form-check-input" type="checkbox">
                    <label class="form-check-label" for="check-continue-create">{{ $t('ui.continue_create') }}</label>
                </div>
                <button type="button" class="btn btn-primary" :disabled="isLoading || model.attributes.length === 0" @click="submit">{{ $t('ui.save') }}</button>
            </div>
        </template>
    </div>
</template>