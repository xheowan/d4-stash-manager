import type { IItem } from "~/stores/stash";

export const initItemModel = (): IItem => ({
    id: undefined,
    type: undefined,
    name: undefined,
    itemPower: 0,
    quality: [],
    attributes: [],
    levelLimit: 0,
    stashTab: 1
});

export function useStash() {

    // store
    const store = useStashStore();
    const { data } = storeToRefs(store);
    

    return {
        items: computed(() => {
            return data.value
        }),

        add: store.add,
        remove: store.remove
    }
}