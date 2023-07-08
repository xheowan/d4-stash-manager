import { IItem, IItemAttribute, ItemAttributeType } from '~/stores';
import { orderBy } from '~/utils';

export interface IListItem extends IItem {
    legendary?: IItemAttribute
}

export type GroupItem = {
    [key: string]: IListItem[]
}

export enum FlagAction {
    Remove = 'remove'
}

export enum ViewMode {
    Tab = 'tab',
    Legendary = 'legendary'
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
    stashTab: 1,
    flags: []
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

    const viewMode = ref<ViewMode>(ViewMode.Tab);
    const changeView = () => {
        viewMode.value = viewMode.value === ViewMode.Tab ? ViewMode.Legendary : ViewMode.Tab;
    }

    return {
        // data, group list
        list: data, //computed(() => data.value),
        groupList: computed(() => {
            let query = data.value;

            if (viewMode.value === ViewMode.Legendary) {
                query = orderBy(query, ['itemPower', 'type'], ['desc', 'asc']);
            } else {
                query = orderBy(query, ['type', 'itemPower'], ['asc', 'desc']);
            }

            return query
                .reduce<GroupItem>((acc, item) => {
                    const legendary = item.attributes.find(f => f.type === ItemAttributeType.LegendaryAspect)
                    // create list item
                    const listitem: IListItem = {
                        ...item,
                        legendary
                    };

                    // group key
                    let key = item.stashTab.toString();

                    if (viewMode.value === ViewMode.Legendary) {
                        if (legendary) {
                            key = legendary.id as string;
                        } else {
                            key = 'other'
                        }
                    }
                        
                    if (acc.hasOwnProperty(key)) {
                        acc[key].push(listitem);
                    } else {
                        acc[key] = [listitem];
                    }

                    return acc
                }, {})

            // return chain<IItem>(data.value)
            //     .orderBy(['itemPower'], ['desc'])
            //     .groupBy('stashTab')
            //     .value(); 
        }),
        viewMode,
        changeView,
        // crud item
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
            confirm(t('ui.prompt_delete_confirm')) && store.remove(id);
        },
        // flag item
        flagItem: (flag: FlagAction, id?: string) => {
            const item = data.value.find(i => i.id == id);
            if (!item) {
                return;
            }

            if (item.flags.includes(flag)) {
                // remove flag
                const idx = item.flags.findIndex(f => f == flag);
                item.flags.splice(idx, 1);
            } else {
                // add flag
                item.flags.push(flag);
            }
            
        },
        removeFlaggedItem: () => {
            if (!confirm(t('ui.prompt_delete_flagged_item'))) {
                return;
            }

            const ids = data.value.filter(f => f.id && f.flags.includes(FlagAction.Remove)).map(m => m.id as string);
            store.remove(ids);
        },
        flaggedItemCount: computed(() => data.value.filter(f => f.flags.includes(FlagAction.Remove)).length),
    }
}