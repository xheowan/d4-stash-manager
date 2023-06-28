// Weapons: 100
// Armor: 200
// Accessories: 300
// Legendary Aspects: 400
export enum IItemType {
    Weapons = 100,
    Armor = 200,
    Accessories = 300,
    LegendaryAspects = 400
}

export enum ItemQuality {
    Common = 1,
    Magic = 2,
    Rare = 3,
    Legendary = 4,
    Unique = 5,
    Sacred = 6,
    Ancestral = 7,
}

export interface IItem {
    id: string,
    type: IItemType,
    name: string,

    itemPower: number,
    quality: ItemQuality[], // common, magic, rare, legendary, unique, sacred, ancestral
    properties: IItemProperty[],
    stashTab: number,
    levelLimit: number,
}

export interface IItemProperty {
    id: string,
    values: number[],
    rank: number
}

export const useStashStore = defineStore('stash', () => {
    
    const data = ref<IItem[]>([]);
    
    return {
        data
    }
}, {
    persist: {
        key: STASH_DATA,
        paths: ['data'],
        storage: import.meta.env.SSR ? undefined : sessionStorage,
        // storage: process.client ? persistedState.localStorage : undefined
    }
});

export default useStashStore;

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStashStore, import.meta.hot))
}