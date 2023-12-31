import type { IItem, IItemAttribute } from '.';
import { DataAffix } from '~/composables/affix';

export const useItemStore = defineStore('item', () => {

    const model = ref<IItem>(initItemModel());
    const mainLegendaryAffix = ref<DataAffix>();

    const updateModelByLegendaryAffix = (data: DataAffix) => {
        if (!data.tags.includes('legendary')) {
            return;
        }

        model.value.quality.push(ItemQuality.Legendary);
        
        if (data.prefix) {
            model.value.name = data.prefix;
        }

        mainLegendaryAffix.value = data;
    }

    const addAffix = (data: IItemAttribute) => {
        model.value.attributes.push(data);
    }

    const removeAffix = (affixId?: string) => {
        if (!affixId)
            return false;

        const idx = model.value.attributes.findIndex(f => f.id == affixId);
        const exists = idx !== -1
        if (exists) { 
            model.value.attributes.splice(idx, 1);

            if (mainLegendaryAffix.value?.id == affixId)
                mainLegendaryAffix.value = undefined
        }

        return exists;
    }

    
    return {
        model,
        mainLegendaryAffix,
        addAffix,
        removeAffix,
        updateModelByLegendaryAffix
    }
});

export default useItemStore;

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useItemStore, import.meta.hot))
}

// export const useTestStore = defineStore('test', () => {

//     const model = reactive<IItem>(initItemModel());
//     const mainLegendaryAffix = ref<DataAffix>();

//     return {
//         model,
//         mainLegendaryAffix
//     }
// });