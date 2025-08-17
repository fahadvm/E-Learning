export function validatePagination(page?: string | number, limit?: string | number) {
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;

    if (isNaN(pageNum) || pageNum < 1) {
        return { pageNum: null, limitNum: null, error: 'Invalid page number' };
    }

    if (isNaN(limitNum) || limitNum < 1) {
        return { pageNum: null, limitNum: null, error: 'Invalid page limit' };
    }

    return { pageNum, limitNum, error: null };
}
