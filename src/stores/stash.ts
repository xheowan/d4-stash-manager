import type { IItem } from '.';
import { clone, uuid } from '~/utils';

// Weapons: 100
// Armor: 200
// Accessories: 300
// LegendaryAspects: 400
// export enum IItemType {
//     Weapons = 100,
//     Armor = 200,
//     Accessories = 300,
//     LegendaryAspects = 400
// }


export const useStashStore = defineStore('stash', () => {
    
    const data = ref<IItem[]>([]);

    const clearData = (data: IItem) => {

        // sort quality
        data.quality.sort((a, b) => b - a);

        return data;
    }

    const add = (item: IItem) => {
        const nItem = clone(item);
        nItem.id = uuid().replaceAll('-', '');

        data.value.push(clearData(nItem));
    }

    const update = (item: IItem) => {
        const idx = data.value.findIndex(i => i.id == item.id);
        data.value[idx] = clearData(clone(item));
    }

    const remove = (id: string | string[]) => {
        const removeIds = typeof id === 'string' ? [id] : id;
        
        for (const id of removeIds) {
            const idx = data.value.findIndex(i => i.id == id);
            data.value.splice(idx, 1);
        }
    }
    
    return {
        data,
        add,
        update,
        remove
    }
}, {
    persist: {
        key: STASH_DATA,
        paths: ['data'],
        storage: import.meta.env.SSR ? undefined : localStorage,
        // storage: process.client ? persistedState.localStorage : undefined
    }
});

export default useStashStore;

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStashStore, import.meta.hot))
}