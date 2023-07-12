import { useDebounceFn } from '@vueuse/core';
import dataAffixes from '~/data/affixes.json';
import { ItemType } from '~/stores';
import { convertTypeValueToCategory } from './item';
import { toCapitalize } from '~/utils';


export type DataAffix = {
    id: string,
    prefix?: string,
    title: string,
    valueRange: string[],
    powerIncrease?: Record<string, number[]>,
    requiredItemType: string[],
    itemTypeSlot? :string[],
    tags: string[]
}

let i18nAffixData: DataAffix[];

export function createI18nAffixes() {
    if (!i18nAffixData) {
        const { t } = useI18n();

        i18nAffixData = dataAffixes.map((item) => {
            item.title = t(`item_attributes.${item.id}`, ['n']).trim();

            if (item.prefix) {
                item.prefix = t(`item_affix_prefix.${item.id}`, ['']).trim();
            }
            
            return {
                ...item,
                itemTypeSlot: convertItemTypeSlot(item.requiredItemType)
            };
        });
    }
    
    return i18nAffixData;
}

export function convertItemTypeSlot(list: string[]) {
    return list.reduce((acc, value) => {
        const typeKey = toCapitalize(value).replace('1h', '1H').replace('2h', '2H');

        const typeId = ItemType[typeKey as keyof typeof ItemType];
        const categoryId = convertTypeValueToCategory(typeId);


        if (categoryId == ItemCategory.OneHandedWeapons)
            value = '1h_weapon';
        else if (categoryId == ItemCategory.TwoHandedWeapons)
            value = '2h_weapon';
        else if (categoryId == ItemCategory.Offhand)
            value = 'offhand';
        
        if (!acc.includes(value))
            acc.push(value);
        
        return acc;
    }, [] as string[]);
}

export function useAffixSearch(pageCount = 5) {

    const dataAffixes = createI18nAffixes();

    // data
    // const data = ref<DataAffix[]>([]);

    // search
    const searchResult = ref<DataAffix[]>();

    // pagination
    const displayedItemCount = ref(pageCount);
    
    const pagedSearchResult = computed(() => searchResult.value?.slice(0, displayedItemCount.value));

    const remainingItemCount = computed(() => {
        if (!searchResult.value)
            return 0;
        
        const leftCount = searchResult.value.length - displayedItemCount.value;
        return leftCount > pageCount ? pageCount : leftCount;
    });

    const reset = () => {
        searchResult.value = undefined;
        displayedItemCount.value = pageCount;
    }

    const search = (text: string) => {
        if (!text || text.length < 2) {
            reset();
            return;
        }
    
        searchResult.value = dataAffixes
            .filter(f =>
                f.title.includes(text) || f.prefix?.includes(text)
                // !model.value.attributes.some(s => s.id == f.id)
            )
            .sort((a, b) => a.title.localeCompare(b.title));
    }

    // search debounce input proxxy
    const inputSearch = useDebounceFn((e) => search(e.target.value), 500);


    return {
        // data,
        searchResult,
        totalResultCount: computed(() => searchResult.value?.length), 
        pagedSearchResult,
        remainingItemCount,
        search,
        inputSearch,
        showMore: () => {
            displayedItemCount.value += pageCount;
        },
        reset
    }
}