import { useDebounceFn } from '@vueuse/core';
import { groupBy } from 'lodash-es';
import { IItem, IItemAttribute } from '~/stores';
import { convertEnumToOptions, orderBy, toSnakeCase, filterNonNumberValues } from '~/utils';
import { DataAffix } from './affix';

export function convertItemTypeToCategory(value?: string | number) {
    if (!value)
        return 0;
    
    return (Math.floor(Number(value) / 100) % 10) * 100;
}

export function useItemType(limitTypes?: Ref<string[] | undefined>) {
    const { t } = useI18n();

    // const list = convertEnumToOptions(ItemType).map(m => {
    //     m.text = t(`item_type.${toSnakeCase(m.text)}`);
    //     return m;
    // });

    // list = orderBy(list, ['text'], ['asc']);

    // const groupTypeList = groupBy(list, (option) => {
    //     // const cate = (Math.floor(Number(option.value) / 100) % 10) * 100;
    //     const cate = convertItemTypeToCategory(option.value);
    //     return ItemCategory[cate];
    // });

    const list = convertEnumToOptions(ItemType);

    const groupTypeList = computed(() => {
        let query = list;

        if (limitTypes?.value) {
            console.log('filter: ', limitTypes.value, query);
            // f.text = axe|bow|...
            query = query.filter(f => limitTypes.value?.includes(toSnakeCase(f.text)) || convertItemTypeToCategory(f.value) === ItemCategory.LegendaryAspects);
        }

        return groupBy(
            query.map(m => ({
                ...m,
                text: t(`item_type.${toSnakeCase(m.text)}`)
            })),
            (option) => {
                const cate = convertItemTypeToCategory(option.value);
                return ItemCategory[cate];
            }
        );
    });
    
    return {
        groupTypeList
    }
}

export function useItemQuality() {
    const qualityList = orderBy(convertEnumToOptions(ItemQuality), ['value'], ['desc']);
    const qualityGroup1 = [ItemQuality.Common, ItemQuality.Magic, ItemQuality.Rare, ItemQuality.Legendary, ItemQuality.Unique];
    const qualityGroup2 = [ItemQuality.Sacred, ItemQuality.Ancestral];

    const validateQualityData = (value: string[]) => {
        const a = value.filter(val => qualityGroup1.includes(parseInt(val)));
        const b = value.filter(val => qualityGroup2.includes(parseInt(val)));
    
        if (a.length == 2)
            a.shift();
        if (b.length == 2)
            b.shift();
        
        return [...a, ...b];
    }

    return {
        qualityList,
        validateQualityData
    }
}

export function useItem() {
    const { t } = useI18n();

    // store
    const store = useItemStore();
    const {
        model,
        mainLegendaryAffix,
    } = storeToRefs(store);


    const toggleAffix = (affix: DataAffix) => {
        if (!store.removeAffix(affix.id)) {
            if (affix.tags.includes('legendary') && model.value.attributes.some(s => s.type === ItemAttributeType.LegendaryAspect)) {
                alert(t('ui.prompt_item_affix_legendary_exists'));
                return;
            }

            const rank = model.value.attributes.length;
            
            let type = ItemAttributeType.Affix;
            if (affix.tags.includes('legendary')) {
                type = ItemAttributeType.LegendaryAspect;
            }

            store.addAffix({
                id: affix.id,
                type,
                values: [],
                rank
            });

            store.updateModelByLegendaryAffix(affix);
        }
    }

    // proxy affix.values
    const inputAffixValues = useDebounceFn((e, item: IItemAttribute) => {
        const val = e.target.value;
        if (val) {
            item.values = filterNonNumberValues(val);
        } else {
            item.values = [];
        }
    }, 500);


    return {
        model,
        mainLegendaryAffix,

        //affix
        removeAffix: store.removeAffix,
        toggleAffix,
        inputAffixValues,

        isAffixExists: (affixId: string) => model.value.attributes.some(s => s.id === affixId)
    }
}

export const initItemModel = (): IItem => ({
    id: undefined,
    type: undefined,
    name: undefined,
    itemPower: 100,
    quality: [],
    attributes: [],
    requiredLevel: 1,
    upgrade: 0,
    imbued: false,
    stashTab: 1,
    flags: [],
    createTime: undefined
});

export const initAttrModel = (): IItemAttribute => ({
    id: undefined,
    type: ItemAttributeType.Affix,
    values: [],
    rank: 1
});