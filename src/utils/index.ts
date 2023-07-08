/**
 * Generates a universally unique identifier (UUID).
 *
 * @return {string} The generated UUID.
 */
export const uuid = () => {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = ((d + Math.random() * 16) % 16) | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
};

/**
 * Replaces all uppercase letters in a string with an underscore followed by the lowercase letter and converts the string to lowercase.
 *
 * @param {string} value - The string to be converted to snake case.
 * @return {string} The converted string in snake case.
 */
export const toSnakeCase = (value: string) => value
    .replace(/[a-zA-Z]([A-Z])/g, (match) => match[0] + '_' + match[1])
    .toLowerCase();

export type OptionItem = {
    text: string,
    value: string | number
}

export const toCapitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);


/**
 * Converts an enum object into an array of OptionItems.
 *
 * @param {Record<T, string | number>} enumObject - The enum object to convert.
 * @return {OptionItem[]} An array of OptionItems representing the enum values.
 */
export const convertEnumToOptions = <T extends string | number>(enumObject: Record<T, string | number>): OptionItem[] => {
    return Object.entries(enumObject)
        .filter(([key]) => isNaN(Number(key)))
        .map(([key, value]) => ({
            text: key,
            value: value as T
        }));
}


/**
 * Returns the key of the given value in the enumObject with snake case.
 *
 * @param {Record<string, T>} enumObject - The enum object to search in.
 * @param {number} value - The value to find the key for.
 * @return {string} The key of the given value.
 */
export const enumKey = <T extends string | number>(
    enumObject: Record<string, T>,
    value: number
): string | undefined => {
    const key = enumObject[value] as string;
    if (key)
        return toSnakeCase(key);
    else
        return undefined;
}


/**
 * Clones a given value.
 *
 * @param {T} value - The value to be cloned.
 * @return {T} The cloned value.
 */
export const clone = <T>(
    value: T
): T => {
    if (typeof value !== 'object' || value === null) {
        return value;
    }
  
    if (Array.isArray(value)) {
        return value.map((item) => clone(item)) as T;
    }
  
    const clonedObject = {} as T;
    for (const key in value) {
        if (value.hasOwnProperty(key)) {
            clonedObject[key] = clone(value[key]);
        }
    }
  
    return clonedObject;
}


interface OrderByComparator<T> {
    (a: T, b: T): number;
}

/**
 * Sorts the elements of an array based on the specified criteria.
 *
 * @param {T[]} collection - The array to be sorted.
 * @param {keyof T[]} iteratees - The properties of the objects to sort by.
 * @param {('asc' | 'desc')[]} orders - The sort order for each property.
 * @return {T[]} The sorted array.
 */
export const orderBy = <T extends object>(
    collection: T[],
    iteratees: (keyof T)[],
    orders: ('asc' | 'desc')[]
): T[] => {
    const comparators: OrderByComparator<T>[] = iteratees.map((key, index) => {
        const order = orders[index] === 'desc' ? -1 : 1;
        return (a, b) => {
            if (a[key] < b[key]) return -1 * order;
            if (a[key] > b[key]) return 1 * order;
            return 0;
        };
    });

    collection.sort((a, b) => {
        for (let i = 0; i < comparators.length; i++) {
            const result = comparators[i](a, b);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    });

    return collection;
}



// export const groupBy = <T>( //, K extends string | number | keyof T
//     collection: T[],
//     iteratee: K | ((value: T) => K)
// ): Record<K, T[]> => {
//     return collection.reduce((result, value) => {
//         // const key = typeof iteratee === 'function' ? (iteratee as (value: T) => K)(value) : value[iteratee];
//         const key = typeof iteratee === 'function' ? iteratee(value) : (value[iteratee as keyof T]);
        
//         if (!(key in result)) {
//             result[key] = [];
//         }

//         result[key].push(value);
        
//         return result;
//     }, {} as Record<K, T[]>);
// }