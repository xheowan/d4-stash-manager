export enum ItemCategory {
    OneHandedWeapons = 100,
    TwoHandedWeapons = 200,
    Offhand = 300,
    Armor = 400,
    Accessories = 500,
    LegendaryAspects = 600
}

export enum ItemType {
    // 1H Weapons: 100
    Axe = 101, //斧
    Dagger = 102, //匕首
    Mace = 103, //錘
    Scythe = 104, //鐮刀
    Sword = 105, //劍
    Wand = 106, //魔杖
    
    // 2H Weapons: 200
    Axe2H = 201, //雙手斧
    Bow = 202, //弓
    Crossbow = 203, //弩
    Mace2H = 204, //雙手錘
    Polearm = 205, //長柄武器
    Scythe2H = 206, //雙手鐮刀
    Staff = 207, //雙手法杖
    Sword2H = 208, //雙手劍

    // Offhand: 300
    Focus = 301, //法器
    Shield = 302, //盾
    Totem = 303, //圖騰

    // Armor: 400
    Helm = 401, //頭盔
    ChestArmor = 402, //胸甲
    Gloves = 403, //手套
    Pants = 404, //褲子
    Boots = 405, //靴子
    
    // Accessories: 500
    Amulet = 501, //護身符
    Ring = 502, //戒指

    // LegendaryAspects: 600
    AspectDefensive = 601, //防禦精華
    AspectMobility = 602, //機動精華
    AspectOffensive = 603, //攻擊精華
    AspectResource = 604, //資源精華
    AspectUtility = 605 //通用精華
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

export enum ItemAttributeType {
    Property = 1,
    Affix = 2,
    LegendaryAspect = 3
}

// /*
// item property or affix
// 屬性（Properties）：屬性是裝備物品本身固有的特性或數值。這些屬性可以直接影響角色的能力和屬性，例如武器的攻擊力、護甲的防禦力、飾品的生命增益等。屬性通常是固定且與物品相關聯的。
// 修飾（Affixes）：修飾是在裝備物品上額外添加的特殊效果或增強，通常以隨機或可變化的方式出現。修飾可以提供額外的屬性、能力或效果，例如增加攻擊速度、提供額外傷害、提高技能效果等。修飾的出現通常是隨機的，這意味著玩家可以在探索或獲得新裝備時發現不同的修飾。
// 修飾符（Modifiers）
// */
export interface IItemAttribute {
    id?: string;
    type: ItemAttributeType;
    values: number[];
    rank: number;
}

export interface IItem {
    id?: string;
    type?: ItemType;
    name?: string;

    itemPower: number;
    quality: number[];
    attributes: IItemAttribute[];
    requiredLevel: number;
    upgrade: number;
    imbued: boolean;

    stashTab: number; //分頁

    flags: string[]; //標記
    createTime?: number;
}

// export interface ICreateItem extends Omit<IItem, 'id' | 'type' | 'name'> {
//     id?: string;
//     type?: ItemType;
//     name?: string;
// }