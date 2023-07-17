<script setup lang="ts">
import { IItem } from '~/stores';

// props & emit
const props = defineProps<{
    model?: IItem
}>();

defineEmits(['submit']);


// model
const { model } = toRefs(props);
const isLoading = ref(false);

// model level
// const maxItemUpgradeLevel = computed(() => 5);

// submit
const $form = ref<HTMLFormElement | null>(null);

const formSubmit = () => {
    $form.value?.dispatchEvent(new Event('submit', { cancelable: true }));
}

</script>

<template>
    <div class="modal-body item-editor">
        <form v-if="model" ref="$form" v-submit="() => $emit('submit')" class="needs-validation" novalidate>
            <input v-model="model.id" type="hidden" />

            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_name') }}</label>
                <input v-model="model.name" type="text" class="form-control" :placeholder="$t('form.item_name_placeholder')" required />
                <div class="invalid-feedback">{{ $t('form.item_name_invalid') }}</div>
            </div>

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
                <input v-model="model.itemPower" v-filter-number type="number" class="form-control" min="1" max="850" />
            </div>

            <div class="mb-3 item-attributes">
                <label for="type" class="form-label">{{ $t('form.item_attribute') }}</label>
                <CtrlItemAffix v-model="model.attributes" :item-type="model.type" />
            </div>

            <div class="row mb-3">
                <div class="col">
                    <label class="form-label">{{ $t('form.item_required_level') }}</label>
                    <input v-model="model.requiredLevel" v-input-select v-filter-number type="number" class="form-control" min="1" max="100" />
                </div>

                <div class="col">
                    <label class="form-label">{{ $t('form.item_upgrade') }}</label>
                    <input v-model="model.upgrade" v-input-select v-filter-number type="number" class="form-control" min="0" :max="5" :disabled="convertItemTypeToCategory(model.type || 0) === ItemCategory.LegendaryAspects" />
                </div>

                <div class="col-md-3 col text-end align-self-end">
                    <input id="item-imbued" v-model="model.imbued" type="checkbox" class="btn-check" autocomplete="off">
                    <label for="item-imbued" class="btn btn-outline-secondary mt-1">{{ $t('form.item_already_imbued') }}</label>
                </div>
            </div>

            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_stash_tab') }}</label>
                <input v-model.number="model.stashTab" v-input-select v-filter-number type="number" class="form-control" min="0" />
            </div>

            <!-- <button type="submit" class="btn btn-primary" :disabled="isLoading">{{ $t('ui.save') }}</button> -->
        </form>
    </div>
    <div class="modal-footer justify-content-end">
        <button type="button" class="btn btn-primary" :disabled="isLoading" @click="formSubmit">{{ $t('ui.save') }}</button>
    </div>
</template>