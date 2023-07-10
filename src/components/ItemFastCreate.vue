<script setup lang="ts">
import { useItem } from '~/composables/item';
import type CtrlAffixSearch from './CtrlAffixSearch.vue';

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
    inputAffixValues,
} = useItem();


const nextStep = () => {
    if (!model.value.attributes.length) {
        alert(t('ui.prompt_select_at_least_one_affix'));
        return;
    }

    step.value = 2;
}

// model save
const continueCreate = ref(true);
const submit = () => {
    emit('submit', model.value, continueCreate.value);
    model.value = initItemModel();
    ctrlSearch.value?.reset();

    // reset
    if (continueCreate.value) {
        step.value = 1;
    }
}

</script>

<template>
    <div class="item-fast-create">
        <!--step 1-->
        <template v-if="step === 1">
            <CtrlAffixSearch ref="ctrlSearch" @select="({ item }) => toggleAffix(item)" />

            <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-outline-primary" :disabled="!model.attributes.length" @click="nextStep">{{ $t('ui.next_step') }}</button>
            </div>
        </template>
        <!--step 2-->
        <template v-else-if="step === 2">
            <!--item attributes-->
            <div class="mb-3">
                <label class="form-label">{{ $t('form.item_attribute') }}</label>
                <div class="list-group">
                    <div 
                        v-for="item in model.attributes" 
                        :key="item.id" 
                        class="list-group-item"
                    >
                        <div class="row">
                            <div class="col-9">
                                <label class="form-label" :for="`attr-item-${item.id}`">
                                    <ItemAffix :data="item" />
                                </label>
                            </div>
                            <div class="col-3">
                                <input 
                                    :id="`attr-item-${item.id}`" 
                                    type="text" 
                                    class="form-control mb-2"
                                    :value="item.values.join(',')"
                                    :placeholder="$t('form.item_affix_range')"
                                    @input="inputAffixValues($event, item)"
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
                <CtrlItemType v-model="model.type" class="form-select" :filter="mainLegendaryAffix?.requiredItemType" required />
            </div>

            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_power') }}</label>
                <input v-model="model.itemPower" type="number" class="form-control" min="1" max="850" @click="(e) => (e.target as HTMLInputElement).select()" />
            </div>

            <template v-if="showMoreInput">
                <div class="row mb-3">
                    <div class="col">
                        <label for="type" class="form-label">{{ $t('form.item_upgrade') }}</label>
                        <input v-model="model.upgrade" type="number" class="form-control" min="0" :max="5" />
                    </div>
                    <div class="col">
                        <label for="type" class="form-label">{{ $t('form.item_required_level') }}</label>
                        <input v-model="model.requiredLevel" type="number" class="form-control" min="1" max="100" />
                    </div>
                </div>

                <div class="mb-3">
                    <label for="type" class="form-label">{{ $t('form.item_stash_tab') }}</label>
                    <input v-model.number="model.stashTab" type="number" class="form-control" min="1" />
                </div>
            </template>
            

            <!-- prev step and save button-->
            <div class="d-flex justify-content-between">
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
            </div>
        </template>
    </div>
</template>