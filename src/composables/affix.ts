import { useDebounceFn } from '@vueuse/core';
import srouceAffixes from '~/data/affixes.json';
import { ItemType } from '~/stores';
import { convertItemTypeToCategory } from './item';
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

let dataI18nAffix: DataAffix[];
const dicI18nAffix: {
    [key: string]: DataAffix
} = {};

export function createI18nAffixes() {
    if (!dataI18nAffix) {
        const { t } = useI18n();

        dataI18nAffix = srouceAffixes.map((item) => {
            item.title = t(`item_attributes.${item.id}`, ['n']).trim();

            if (item.prefix) {
                item.prefix = t(`item_affix_prefix.${item.id}`, ['']).trim();
            }

            const newitem = {
                ...item,
                itemTypeSlot: convertItemTypeSlot(item.requiredItemType)
            };

            dicI18nAffix[item.id] = newitem;
            
            return newitem;
        });
    }
    
    return dataI18nAffix;
}

export function findAffix(id: string | undefined) {
    if (id) {
        return dicI18nAffix[id];
    }
    
    return undefined;
}


type TypeCount = {
    [key: string]: number
}

export function findDuplicateItemTypes(items: DataAffix[]) {
    const itemTypeCounts = items
        .reduce<TypeCount>((acc, item) => {
            item.requiredItemType.forEach(type => {
                if (acc[type]) {
                    acc[type] += 1;
                } else {
                    acc[type] = 1;
                }
            });

            return acc;
        }, {});
    
    return Object.keys(itemTypeCounts).filter(key => itemTypeCounts[key] == items.length);
}

export function convertItemTypeSlot(list: string[]) {
    return list.reduce((acc, value) => {
        const typeKey = toCapitalize(value).replace('1h', '1H').replace('2h', '2H');

        const typeId = ItemType[typeKey as keyof typeof ItemType];
        const categoryId = convertItemTypeToCategory(typeId);


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

export function useAffixSearch(source: DataAffix[], pageCount = 5) {

    const dataAffixes = createI18nAffixes();

    // data
    const data = ref<DataAffix[]>(source);

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

    const itemTypeFilter = computed(() => findDuplicateItemTypes(data.value));

    const reset = () => {
        searchResult.value = undefined;
        displayedItemCount.value = pageCount;
    }

    const search = (text: string) => {
        if (!text || text.length < 2) {
            reset();
            return;
        }

        let query = dataAffixes.concat();

        if (itemTypeFilter.value.length > 0) {
            query = query.filter(f => f.requiredItemType.some(e => itemTypeFilter.value.includes(e)));
        }
    
        searchResult.value = query
            .filter(f => f.title.includes(text) || f.prefix?.includes(text))
            .sort((a, b) => a.tags.includes('legendary') ? -1 : b.tags.includes('legendary') ? 1 : 0);
            // .sort((a, b) => a.title.localeCompare(b.title));
    }

    // search debounce input proxxy
    const inputSearch = useDebounceFn((e) => search(e.target.value), 500);


    return {
        data,
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