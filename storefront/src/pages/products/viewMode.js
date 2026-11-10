export const VIEW_PARAM = 'view';
export const VIEW_GRID = 'grid';
export const VIEW_LIST = 'list';

// Reads the `view` param: only `list` switches the view, anything else is the grid.
export const parseViewParam = (searchParams) =>
    searchParams?.get?.(VIEW_PARAM) === VIEW_LIST ? VIEW_LIST : VIEW_GRID;

// Returns a copy of `searchParams` with `view` set (list) or removed (grid);
// all other params (categories…) are kept.
export const serializeViewParam = (view, searchParams = new URLSearchParams()) => {
    const params = new URLSearchParams(searchParams);
    if (view === VIEW_LIST) params.set(VIEW_PARAM, VIEW_LIST);
    else params.delete(VIEW_PARAM);
    return params;
};
