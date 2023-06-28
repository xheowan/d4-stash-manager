export function useStash() {

    // store
    const store = useStashStore();
    const { data } = storeToRefs(store);
    

    return {
        items: data
    }
}