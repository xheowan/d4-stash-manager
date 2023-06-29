import type { IItem } from '~/stores';
import { chain } from 'lodash-es';

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

export function useStash() {

    const { t } = useI18n();
    // store
    const store = useStashStore();
    const { data } = storeToRefs(store);
    

    return {
        groupList: computed(() => {
            return chain<IItem>(data.value)
                .sortBy(['itemPower'])
                .groupBy('stashTab')
                .value(); 
        }),

        add: (item: IItem) => {
            if (!item.name) {
                console.log('miss item name');
                return;
            }

            store.add(item);
        },
        update: (item: IItem) => {
            store.update(item);
        },
        remove: (id: string) => {
            confirm(t('prompt.remove_confirm')) && store.remove(id);
        }
    }
}