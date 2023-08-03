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
    const season = ref<IItem[]>([]);
    const type = ref('data');

    const $target = computed({
        get: () => type.value === 'data' ? data.value : season.value,
        set: (value) => {
            if (type.value === 'data') {
                data.value = value;
            } else {
                season.value = value;
            }
        }
    });

    // watch($target, () => {
    //     console.log(type.value, $target.value, data.value, season.value);
    // });

    const clearData = (data: IItem) => {

        // sort quality
        data.quality.sort((a, b) => b - a);

        return data;
    }

    const add = (item: IItem) => {
        const newitem = clone(item);
        newitem.id = uuid().replaceAll('-', '');
        newitem.createTime = new Date().getTime();

        // const target = type.value === 'data' ? data : season;
        $target.value.push(clearData(newitem));
    }

    const update = (item: IItem) => {
        const idx = $target.value.findIndex(i => i.id == item.id);
        $target.value[idx] = clearData(clone(item));
    }

    const remove = (id: string | string[]) => {
        const removeIds = typeof id === 'string' ? [id] : id;
        
        for (const id of removeIds) {
            const idx = $target.value.findIndex(i => i.id == id);
            $target.value.splice(idx, 1);
        }
    }
    
    return {
        type,
        season,
        data,
        $target,
        add,
        update,
        remove,
        import: (jsondata: IItem[]) => {
            $target.value = jsondata;
            // data.value = jsondata;
        }
    }
}, {
    persist: {
        key: STASH_DATA,
        paths: [
            'data',
            'season',
            'type'
        ],
        storage: import.meta.env.SSR ? undefined : localStorage,
        // storage: process.client ? persistedState.localStorage : undefined
    }
});

export default useStashStore;

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStashStore, import.meta.hot))
}