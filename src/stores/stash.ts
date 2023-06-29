import { clone } from "lodash-es";
import { uuid } from "~/utils";

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

export enum ItemType {

    OffHands = '100', //副手

    Helm = '201', //頭盔
    Chest = '202', //胸甲
    Gloves = '203', //手套
    Pants = '204', //褲子
    Boots = '205', //靴子
    Shield = '206', //盾

    Amulet = '301', //護身符
    Rings = '302', //戒指


}

export enum ItemQuality {
    Common = '1',
    Magic = '2',
    Rare = '3',
    Legendary = '4',
    Unique = '5',
    Sacred = '6',
    Ancestral = '7',
}

export enum ItemAttributeType {
    Property = '1',
    Affix = '2',
    LegendaryAspects = '3'

    // WeaponPreporty = 1,
    // ArmorPreporty = 2,
    // AccessoryPreporty = 3,
}

// /*
// item property or affix
// 屬性（Properties）：屬性是裝備物品本身固有的特性或數值。這些屬性可以直接影響角色的能力和屬性，例如武器的攻擊力、護甲的防禦力、飾品的生命增益等。屬性通常是固定且與物品相關聯的。
// 修飾（Affixes）：修飾是在裝備物品上額外添加的特殊效果或增強，通常以隨機或可變化的方式出現。修飾可以提供額外的屬性、能力或效果，例如增加攻擊速度、提供額外傷害、提高技能效果等。修飾的出現通常是隨機的，這意味著玩家可以在探索或獲得新裝備時發現不同的修飾。
// 修飾符（Modifiers）
// */
export interface IItemAttribute {
    id: string,
    type: ItemAttributeType,
    values: number[],
    rank: number
}

export interface IItem {
    id?: string,
    type?: ItemType,
    name?: string,

    itemPower: number,
    quality: ItemQuality[], // common, magic, rare, legendary, unique, sacred, ancestral
    attributes: IItemAttribute[],
    levelLimit: number,

    stashTab: number,
}


export const useStashStore = defineStore('stash', () => {
    
    const data = ref<IItem[]>([]);

    const add = (item: IItem) => {
        const nItem = clone(item);
        nItem.id = uuid();
        
        data.value.push(nItem);
    }

    const remove = (id: string) => {
        const idx = data.value.findIndex(i => i.id == id);
        data.value.splice(idx, 1);
    }
    
    return {
        data,
        add,
        remove
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