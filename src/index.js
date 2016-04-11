import PageMerger from 'src/page-merger';
import PaginatorError from 'src/paginator-error';
import paginators from 'src/paginators';
import queryHandlers from 'src/query-handlers';


export {PageMerger as PageMerger};
export {PaginatorError as PaginatorError};
export {paginators as paginators};
export {queryHandlers as queryHandlers};

export const paginate = function(request, reqOpts, queryParams) {
  return new paginators.PageNumberPaginator(request, reqOpts, queryParams);
};

export const all = function(request, reqOpts, queryParams) {
  let paginator;

  if (typeof request === 'function') {
    paginator = paginate(request, reqOpts, queryParams);
  } else {
    paginator = request;
  }

  const pageMerger = new PageMerger(paginator);
  const mergeAllPages = function(pageCount) {
    return pageMerger.merge(1, pageCount);
  };

  return paginator.fetchPageCount()
    .then(mergeAllPages);
};

const drfPaginator = {
  all,
  PageMerger,
  paginate,
  PaginatorError,
  paginators,
  queryHandlers
};

export default drfPaginator;
module.exports = drfPaginator;
