export const uuid = () => {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = ((d + Math.random() * 16) % 16) | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
};

export type OptionItem = {
    text: string,
    value: string | number
}

export const convertEnumToOptions = <T extends string | number>(enumObject: Record<T, string | number>): OptionItem[] => {
    return Object.entries(enumObject)
        .filter(([key]) => isNaN(Number(key)))
        .map(([key, value]) => ({
            text: key,
            value: value as T
        }));
}