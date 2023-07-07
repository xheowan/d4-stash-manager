import { useDebounceFn } from '@vueuse/core';
import { groupBy } from 'lodash-es';
import { IItemAttribute } from '~/stores';
import { convertEnumToOptions, orderBy } from '~/utils';
import { createI18nAffixes, DataAffix } from './affix';

export function useItemType() {
    const groupTypeList = groupBy(convertEnumToOptions(ItemType), (option) => {
        const cate = (Math.floor(Number(option.value) / 100) % 10) * 100;
        return ItemCategory[cate];
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
    const dataAffixes = createI18nAffixes();

    // store
    const store = useItemStore();
    const {
        model,
        mainLegendaryAffix,
    } = storeToRefs(store);


    const updateModelByAffix = (itemId: string) => {
        mainLegendaryAffix.value = dataAffixes.find(s => s.id == itemId);
        if (!mainLegendaryAffix.value)
            return;
    
        model.value.quality.push(ItemQuality.Legendary);
        
        if (mainLegendaryAffix.value.prefix) {
            model.value.name = t(`item_affix_prefix.${mainLegendaryAffix.value.id}`, ['']).trim();
        }
    }

    // const inputUpdateType = useDebounceFn(() => {

    // }, 1000);

    const toggleAffix = (affix: DataAffix) => {
        if (!store.removeAffix(affix.id)) {
            const rank = model.value.attributes.length;
            if (rank === 0) {
                updateModelByAffix(affix.id);
            }
            
            let type = ItemAttributeType.Affix;
            if (affix.tags.includes('legendary')) {
                type = ItemAttributeType.LegendaryAspect;
            }
    
            if (affix.tags.includes('legendary') && model.value.attributes.some(s => s.type === ItemAttributeType.LegendaryAspect)) {
                alert(t('ui.prompt_item_affix_legendary_exists'));
                return;
            }
    
            store.addAffix({
                id: affix.id,
                type,
                values: [],
                rank
            });
        }
    }

    // proxy affix.values
    const inputAffixValues = useDebounceFn((e, item: IItemAttribute) => {
        const val = e.target.value;
        if (val) {
            item.values = val.split(',').map(Number);
        } else {
            item.values = [];
        }
    }, 500);


    return {
        model,

        //affix
        removeAffix: store.removeAffix,
        toggleAffix,
        inputAffixValues,

        isAffixExists: (affixId: string) => model.value.attributes.some(s => s.id === affixId)
    }
}

// export const useTest = () => {
//     const store = useTestStore();
//     const {
//         model,
//         mainLegendaryAffix
//     } = storeToRefs(store);


//     return {
//         model
//     }
// }