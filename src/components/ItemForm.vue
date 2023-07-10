<script setup lang="ts">
import { IItem } from '~/stores'

// props & emit
const props = defineProps<{
    model?: IItem
}>();

const emit = defineEmits(['submit']);


// model
const { model } = toRefs(props);
const isLoading = ref(false);

// model level
const maxItemUpgradeLevel = computed(() => 5);


// submit
const submit = () => {
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
                <CtrlItemQuality v-model="model.quality" />
            </div>

            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_type') }}</label>
                <CtrlItemType v-model="model.type" class="form-select" required />
            </div>

            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_power') }}</label>
                <input v-model="model.itemPower" type="number" class="form-control" min="1" max="850" />
            </div>

            <div class="mb-3 item-attributes">
                <label for="type" class="form-label">{{ $t('form.item_attribute') }}</label>
                <CtrlItemAffix v-model="model.attributes" :item-type="model.type" />
            </div>

            <div class="row mb-3">
                <div class="col">
                    <label for="type" class="form-label">{{ $t('form.item_upgrade') }}</label>
                    <input v-model="model.upgrade" type="number" class="form-control" min="0" :max="maxItemUpgradeLevel" />
                </div>
                <div class="col">
                    <label for="type" class="form-label">{{ $t('form.item_required_level') }}</label>
                    <input v-model="model.requiredLevel" type="number" class="form-control" min="1" max="100" />
                </div>
            </div>
            <!-- <div class="mb-3">
                
            </div>

            <div class="mb-3">
                
            </div> -->

            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_stash_tab') }}</label>
                <input v-model.number="model.stashTab" type="number" class="form-control" min="1" />
            </div>

            <div class="text-end">
                <button type="submit" class="btn btn-primary" :disabled="isLoading">{{ $t('ui.save') }}</button>
            </div>
        </form>
    </div>
</template>