import { useQuery } from "@tanstack/react-query";

import { getCars, getCarBySlug } from "./carApi";
import { carKeys } from "./carKeys";

export const useCarsQuery = (filters) => {
    return useQuery({
        queryKey: carKeys.list(filters),

        queryFn: () => getCars(filters),

        placeholderData: (previous) => previous,
    });
};

export const useCarDetailQuery = (slug) => {
    return useQuery({
        queryKey: carKeys.detail(slug),

        queryFn: () => getCarBySlug(slug),

        enabled: !!slug,
    });
};