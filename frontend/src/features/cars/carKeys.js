export const carKeys = {
    all: ["cars"],

    lists: () => [...carKeys.all, "list"],

    list: (filters) => [...carKeys.lists(), filters],

    detail: (slug) => [...carKeys.all, slug],
};