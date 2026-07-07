/**
 * Convert a value to an array.
 *
 * Examples:
 * "abc"           -> ["abc"]
 * ["a","b"]       -> ["a","b"]
 * undefined/null  -> []
 */

const normalizeArray = (value) => {
    if (!value) return [];

    return Array.isArray(value) ? value : [value];
};

export default normalizeArray;