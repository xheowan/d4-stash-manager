<script setup lang="ts">
import { DataAffix, useAffixSearch } from '~/composables/affix';

const props = withDefaults(defineProps<{
    items?: DataAffix[]
}>(), {
    items: () => []
});
const { items } = toRefs(props);
const emit = defineEmits(['selected']);

const {
    pagedSearchResult,
    remainingItemCount,
    search,
    showMore,
    // reset: resetSearch
} = useAffixSearch();

const selected = (item: DataAffix) => {
    const idx = items.value.findIndex(f => f.id == item.id);
    if (idx !== -1) {
        // exists then remove
        items.value.splice(idx, 1);
    } else {
        // add
        items.value.push(item);
    }
    
    emit('selected', item);
}

</script>

<template>
    <div class="affix-search">
        <div class="mb-3">
            <input type="text" class="form-control" :placeholder="$t('ui.prompt_fast_search_keyword')" @input="search" />
            <div v-if="items.length" class="form-text text-end">{{ $t('ui.display_exists_affix_count', [items.length]) }}</div>
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
                        'selected': items.find(f => f.id === item.id),
                        'text-legendary': item.tags.includes('legendary')
                    }"
                    :title="item.title"
                    @click="selected(item)"
                >
                    <div>
                        <span v-if="item.tags.includes('legendary')" class="badge text-bg-warning mb-2">{{ $t('item_attribute_type.legendary_aspect') }}</span>
                        {{ item.itemTypeSlot }}
                    </div>
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
    </div>
</template>