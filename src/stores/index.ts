export enum ItemCategory {
    Weapons = 100,
    Armor = 200,
    Accessories = 300,
    LegendaryAspects = 400
}

export enum ItemType {
    // Weapons: 100
    Axe = 101, //斧
    Axe2H = 102, //雙手斧
    Bow = 103, //弓
    Crossbow = 104, //弩
    Dagger = 105, //匕首
    Focus = 106, //副手
    Mace = 107, //錘
    Mace2H = 108, //雙手錘
    Polearm = 109, //長柄武器
    Scythe = 110, //鐮刀
    Scythe2H = 111, //雙手鐮刀
    Shield = 112, //盾
    Staff = 113, //雙手法杖
    Sword = 114, //劍
    Sword2H = 115, //雙手劍
    Totem = 116, //圖騰 
    Wand = 117, //魔杖
    // Armor: 200
    Helm = 201, //頭盔
    Chest = 202, //胸甲
    Gloves = 203, //手套
    Pants = 204, //褲子
    Boots = 205, //靴子
    // Accessories: 300
    Amulet = 301, //護身符
    Rings = 302, //戒指
    // LegendaryAspects: 400

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
    LegendaryAspects = 3

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
    quality: string[];
    attributes: IItemAttribute[];
    requiredLevel: number;
    upgrade: number;

    stashTab: number;
}

// export interface ListItem extends Omit<IItem, 'id' | 'type'> {
//     id: string;
//     type: ItemType;
// }

/*
// https://diablo4.cc/tw/Affix
// get all affix data
(function(){
const typeCampare = {
    'chest_armor': 'chest',
    'two-handed_axe': 'axe2h',
    'hand_crossbow': 'crossbow',
    'daggeroffhand': 'dagger',
    'two-handed_mace': 'mace2h',
    'two-handed_scythe': 'scythe2h',
    'two-handed_sword': 'sword2h'
}
let alist = [...document.querySelectorAll('.row .col')].map(elm => {
    const id = elm.querySelector('[data-hover2]').getAttribute('data-hover2').split('/')[1];
    let title = elm.querySelector('.card-header').innerText;

    // fix title format
    title = title.replace('[[', '[').replace(']]', ']').replace('}|1%|', '');

    // get title part
    const regex1 = /\[\d+(?:\.\d+)? – \d+(?:\.\d+)?\]/g;
    const range = title.match(regex1)[0];
    title = title.replace(regex1, '{0}');
    
    const trList = elm.querySelectorAll('.table tbody tr');

    const splitKey = ' – ';
    const powerIncrease = [...trList].reduce((acc, tr) => {
        const key = tr.childNodes[0].innerText;
        let value = tr.childNodes[1].innerText;

        if (value.includes(splitKey)) {
            value = value.slice(1, -1).split(splitKey).map(Number);
            
        } else {
            value = [Number(value)];
        }

        acc[key] = value;        

        return acc;
    }, {});

    const typeList = [...elm.querySelector('.card-body').querySelectorAll('a')].map(a => {
        let type = a.getAttribute('href').toLocaleLowerCase();

        if (typeCampare.hasOwnProperty(type)) {
            type = typeCampare[type];
        }

        return type;
    });

    const clearTypeList = Array.from(new Set(typeList));


    return {
        id,
        title,
        range,
        powerIncrease,
        requiredItemType: clearTypeList
    }
});

console.log(JSON.stringify(alist));
})();

// get data to i18n json
let i18nlist = [...document.querySelectorAll('.row .col')].reduce((acc, elm) => {
    const id = elm.querySelector('[data-hover2]').getAttribute('data-hover2').split('/')[1];
    let title = elm.querySelector('.card-header').innerText;

    // fix title format
    title = title.replace('[[', '[').replace(']]', ']').replace('}|1%|', '');

    // get title part
    const regex1 = /\[\d+(?:\.\d+)? – \d+(?:\.\d+)?\]/g;
    title = title.replace(regex1, '{0}');

    acc[id] = title;

    return acc;
}, {});

JSON.stringify(i18nlist);
*/