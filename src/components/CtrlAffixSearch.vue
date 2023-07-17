<script setup lang="ts">
// import { PropType } from 'vue';
import { DataAffix, useAffixSearch } from '~/composables/affix';

const props = withDefaults(defineProps<{
    modelValue?: DataAffix[]
}>(), {
    modelValue: () => []
});

const emit = defineEmits<{
    (e: 'update:modelValue', data: DataAffix[]): void
    (e: 'select', value: { checked: boolean, item: DataAffix }): void
}>();

// const data = ref<DataAffix[]>(props.modelValue);

const {
    data,
    pagedSearchResult,
    remainingItemCount,
    inputSearch,
    showMore,
    reset
} = useAffixSearch(props.modelValue);


const select = (item: DataAffix) => {

    let checked = false;
    const idx = data.value.findIndex(f => f.id == item.id);
    if (idx !== -1) {
        // exists then remove
        data.value.splice(idx, 1);
    } else {
        // add
        data.value.push(item);
        checked = true;
    }

    emit('update:modelValue', data.value);
    
    emit('select', {
        checked,
        item
    });
}

defineExpose<{
    reset: () => void
}>({
    reset: () => {
        data.value = [];
        reset();
    }
});

</script>

<template>
    <div class="affix-search">
        <div class="mb-3">
            <input type="text" class="form-control" :placeholder="$t('ui.prompt_fast_search_keyword')" @input="inputSearch" />
            <div v-if="data.length" class="form-text text-end">{{ $t('ui.display_exists_affix_count', [data.length]) }}</div>
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
                        'selected': data.find(f => f.id === item.id)
                    }"
                    :title="item.title"
                    @click="select(item)"
                >
                    <div class="mb-2">
                        <small class="text-body-secondary">{{ item.itemTypeSlot?.map(m => $t(`item_type.${m}`)).join(', ') }}</small>
                    </div>
                    <h6 :class="{ 'text-legendary legendary-mark': item.tags.includes('legendary') }">
                        {{ (item.prefix ? `[${item.prefix}] ` : '') + item.title }}
                    </h6>
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
        height: 50px;
        margin-bottom: 0;
        line-height: 1.5;
        overflow: hidden;
    }

    &.selected {
        background-color: $gray-200;
        // color: $orange-400 !important;
    }
}
</style>