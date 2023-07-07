import { useDebounceFn } from '@vueuse/core';
import dataAffixes from '~/data/affixes.json';


export type DataAffix = {
    id: string,
    prefix?: string,
    title: string,
    valueRange: string[],
    powerIncrease?: Record<string, number[]>,
    requiredItemType: string[],
    tags: string[]
}

let i18nAffixData: DataAffix[];

export function createI18nAffixes() {
    if (!i18nAffixData) {
        const { t } = useI18n();

        i18nAffixData = dataAffixes.map((item) => {
            item.title = t(`item_attributes.${item.id}`, ['n']);
            
            return item;
        });
    }
    
    return i18nAffixData;
}


export function useAffixSearch(pageCount = 5) {

    const dataAffixes = createI18nAffixes();
    
    // const pageCount = 5;
    const displayedItemCount = ref(pageCount);

    const searchResult = ref<DataAffix[]>();
    const pagedSearchResult = computed(() => searchResult.value?.slice(0, displayedItemCount.value));

    const remainingItemCount = computed(() => {
        const leftCount = (searchResult.value?.length || 0) - displayedItemCount.value;
        return leftCount > pageCount ? pageCount : leftCount;
    });

    // search debounce input proxxy
    const search = useDebounceFn((e) => {
        const text = e.target.value;
        // const text = keyword.value;
        if (!text || text.length < 2) {
            searchResult.value = undefined;
            displayedItemCount.value = pageCount;
            return;
        }
    
        searchResult.value = dataAffixes
            .filter(f =>
                f.title.includes(text)
                // !model.value.attributes.some(s => s.id == f.id)
            )
            .sort((a, b) => a.title.localeCompare(b.title));
    
    }, 500);

    return {
        totalResultCount: computed(() => searchResult.value?.length), 
        pagedSearchResult,
        remainingItemCount,
        search,
        showMore: () => {
            displayedItemCount.value += pageCount;
        },
        reset: () => {
            searchResult.value = undefined;
        }
    }
}