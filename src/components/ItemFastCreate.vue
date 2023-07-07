<script setup lang="ts">
import { useAffixSearch } from '~/composables/affix';
import { useItem } from '~/composables/item';

const emit = defineEmits(['submit']);

const { t } = useI18n();

const step = ref(1);
const isLoading = ref(false);

// search affixes
const {
    pagedSearchResult,
    remainingItemCount,
    search,
    showMore,
    reset: resetSearch
} = useAffixSearch();

// item model
const {
    model,
    toggleAffix,
    removeAffix,
    inputAffixValues,
    isAffixExists
} = useItem();

const showMoreInput = ref(false);

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
    resetSearch();

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
            <div class="mb-3">
                <input type="text" class="form-control" :placeholder="$t('ui.prompt_fast_search_keyword')" @input="search" />
                <div v-if="model.attributes.length" class="form-text text-end">{{ $t('ui.display_exists_affix_count', [model.attributes.length]) }}</div>
            </div>

            <div v-if="pagedSearchResult" class="mb-3">
                <div class="list-group">
                    <div v-if="pagedSearchResult.length == 0" class="list-group-item">{{ $t('ui.data_not_found') }}</div>
                    <div
                        v-for="item in pagedSearchResult" 
                        :key="item.id" 
                        role="button"
                        class="list-group-item list-group-item-action " 
                        :class="{ 
                            'selected': isAffixExists(item.id),
                            'text-legendary': item.tags.includes('legendary')
                        }"
                        :title="item.title"
                        @click="toggleAffix(item)"
                    >
                        <span v-if="item.tags.includes('legendary')" class="badge text-bg-warning mb-2">{{ $t('item_attribute_type.legendary_aspect') }}</span>
                        <h6>{{ item.title }}</h6>
                    </div>
                </div>

                <button 
                    v-if="remainingItemCount > 0"
                    type="button" 
                    class="btn btn-sm btn-link d-block mx-auto mt-1 text-body-secondary"
                    @click="showMore"
                >
                    {{ $t('ui.display_more_data', [remainingItemCount]) }}
                </button>
            </div>

            <button type="button" class="btn btn-outline-primary float-end" :disabled="!model.attributes.length" @click="nextStep">{{ $t('ui.next_step') }}</button>
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
                <CtrlItemType v-model="model.type" class="form-select" required />
            </div>

            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_power') }}</label>
                <input v-model="model.itemPower" type="number" class="form-control" min="1" max="850" @click="(e) => (e.target as HTMLInputElement).select()" />
            </div>

            <template v-if="showMoreInput">
                <div class="mb-3">
                    <label for="type" class="form-label">{{ $t('form.item_required_level') }}</label>
                    <input v-model="model.requiredLevel" type="number" class="form-control" min="1" max="100" />
                </div>

                <div class="mb-3">
                    <label for="type" class="form-label">{{ $t('form.item_upgrade') }}</label>
                    <input v-model="model.upgrade" type="number" class="form-control" min="0" :max="5" />
                </div>

                <div class="mb-3">
                    <label for="type" class="form-label">{{ $t('form.item_stash_tab') }}</label>
                    <input v-model.number="model.stashTab" type="number" class="form-control" min="1" />
                </div>
            </template>
            

            <!-- prev step and save button-->
            <div class="d-flex justify-content-between">
                <div class="left">
                    <button type="button" class="btn btn-outline-secondary me-2" @click="step = 1">{{ $t('ui.prev_step') }}</button>
                    <button type="button" class="btn btn-outline-secondary" @click="showMoreInput = !showMoreInput">{{ $t(`ui.${showMoreInput ? 'hide' : 'show'}_more_input`) }}</button>
                </div>
                <div class="right">
                    <div class="form-check form-check-inline">
                        <input id="check-continue-create" v-model="continueCreate" class="form-check-input" type="checkbox">
                        <label class="form-check-label" for="check-continue-create">{{ $t('ui.continue_create') }}</label>
                    </div>
                    <button type="button" class="btn btn-primary" :disabled="isLoading" @click="submit">{{ $t('ui.save') }}</button>
                </div>
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.list-group-item {
    // &:not(:hover) {
    //     .btn {
    //         display: none;
    //     }
    // }

    h6 {
        height: 40px;
        margin-bottom: 0;
        overflow: hidden;
    }

    &.selected {
        background-color: $gray-200;
        // color: $orange-400 !important;
    }
}
</style>