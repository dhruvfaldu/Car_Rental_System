export const getPaginationMeta = ({
    page,
    limit,
    total,
}) => ({
    page,
    limit,
    totalRecords: total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPreviousPage: page > 1,
});