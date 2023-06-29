<script setup lang="ts">
import { ItemType, type IItem } from '~/stores/stash';
import { convertEnumToOptions } from '~/utils';

interface Props {
    model?: IItem
}

const props = withDefaults(defineProps<Props>(), {
    model: undefined
});
const { model } = toRefs(props);

const {
    add
} = useStash();

const save = () => {
    if (model.value) {
        add(model.value);
    }
}


const itemTypeList = convertEnumToOptions(ItemType);

console.log(itemTypeList);

</script>

<template>
    <div>
        <form v-if="model">
            <div class="mb-3">
                <label for="type" class="form-label">{{ $t('form.item_type') }}</label>
                <select v-model="model.type" class="form-select">
                    <option :value="undefined">{{ $t('form.item_type_select_prompt') }}</option>
                    <option v-for="option in itemTypeList" :key="option.value">{{ option.text }}</option>
                </select>
            </div>
        </form>
        <button type="button" class="btn btn-primary" @click="save">Save</button>
    </div>
</template>