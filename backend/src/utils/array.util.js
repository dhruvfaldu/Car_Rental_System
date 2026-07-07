export const normalizeArray = (value) => {
    if (!value) return [];

    return Array.isArray(value)
        ? value
        : [value];
};

export const uniqueArray = (arr = []) => {
    return [...new Set(arr)];
};

export const removeEmpty = (arr = []) => {
    return arr.filter(Boolean);
};

export const normalizeUniqueArray = (value) => {
    return uniqueArray(
        removeEmpty(
            normalizeArray(value)
        )
    );
};