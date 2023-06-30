import { IItem, IItemAttribute, ItemAttributeType } from '~/stores';

type gropuItem = {
    [key: string]: IItem[]
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
    stashTab: 1
});

export const initAttrModel = (): IItemAttribute => ({
    id: undefined,
    type: ItemAttributeType.Affix,
    values: [],
    rank: 1
});

export function useStash() {

    const { t } = useI18n();
    // store
    const store = useStashStore();
    const { data } = storeToRefs(store);


    return {
        groupList: computed(() => {
            return data.value
                .sort((a, b) => b.itemPower - a.itemPower)
                .reduce<gropuItem>((acc, item) => {
                    const key = item.stashTab.toString();
                    if (acc.hasOwnProperty(key)) {
                        acc[key].push(item);
                    } else {
                        acc[key] = [item];
                    }

                    return acc
                }, {})

            // return chain<IItem>(data.value)
            //     .orderBy(['itemPower'], ['desc'])
            //     .groupBy('stashTab')
            //     .value(); 
        }),

        addItem: (item: IItem) => {
            if (!item.name) {
                return;
            }

            store.add(item);
        },
        updateItem: (item: IItem) => {
            store.update(item);
        },
        removeItem: (id: string) => {
            confirm(t('prompt.remove_confirm')) && store.remove(id);
        }
    }
}