import { IItem, IItemAttribute, ItemAttributeType } from '~/stores';
import { orderBy } from '~/utils';

export interface IListItem extends IItem {
    legendary?: IItemAttribute
}

export type GroupItem = {
    [key: string]: IListItem[]
}

export type SearchRule = {
    type: 'affix' | 'type' | 'quility';
    value: string | number
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
    flags: [],
    createTime: undefined
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

    const searchRules = ref<SearchRule[]>([]);
    const groupList = computed(() => {
        let query = data.value;

        if (searchRules.value.length) {
            // do something
            query = query.filter(item => searchRules.value.every(rule => {
                if (rule.type === 'affix')
                    return item.attributes.some(f => f.id === rule.value);
                else if (rule.type === 'type')
                    return item.type === Number(rule.value);
                else if (rule.type === 'quility')
                    return item.quality.includes(Number(rule.value));
            }));
        }

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
    });

    const removeSearch = () => {
        searchRules.value = [];
    };

    return {
        // data, group list
        list: data, //computed(() => data.value),
        groupList,

        // view
        viewMode,
        changeView,

        // search
        searchRules,
        removeSearch,

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
            if (confirm(t('ui.prompt_delete_flagged_item'))) {
                const ids = data.value.filter(f => f.id && f.flags.includes(FlagAction.Remove)).map(m => m.id as string);
                store.remove(ids);
            }
        },
        flaggedItemCount: computed(() => data.value.filter(f => f.flags.includes(FlagAction.Remove)).length),

        dataImport: (data: IItem[]) => {
            if (confirm(t('ui.prompt_data_import_confirm'))) {
                store.import(data);
            }
        },
        dataExport: () => {
            // download
            const jsonData = JSON.stringify(data.value, null, 2);

            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const dlink = document.createElement('a');
            dlink.download = `d3sm-data-${new Date().getTime()}.json`;
            dlink.href = url;
            document.body.appendChild(dlink);

            dlink.click();

            document.body.removeChild(dlink);
            URL.revokeObjectURL(url);
        }
    }
}