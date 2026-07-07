const createPagination = ({
    total,
    page,
    limit,
}) => {

    const totalPages = Math.ceil(total / limit);

    return {
        total,
        page,
        limit,
        totalPages,

        hasNext: page < totalPages,

        hasPrev: page > 1,
    };

};

export const getPagination = ({
    page = 1,
    limit = 10,
}) => {
    page = Math.max(Number(page), 1);
    limit = Math.max(Number(limit), 1);

    return {
        page,
        limit,
        skip: (page - 1) * limit,
    };
};

export default createPagination;