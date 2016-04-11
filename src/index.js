import LimitOffsetPaginator from 'src/paginators/limit-offset-paginator';
import LimitOffsetHandler from 'src/query-handlers/limit-offset-query-handler';
import PageMerger from 'src/page-merger';
import PageNumberPaginator from 'src/paginators/page-number-paginator';
import PageNumberHandler from 'src/query-handlers/page-number-query-handler';
import PaginatorError from 'src/paginator-error';


export {LimitOffsetPaginator as LimitOffsetPaginator};
export {LimitOffsetHandler as LimitOffsetQueryHandler};
export {PageMerger as PageMerger};
export {PageNumberPaginator as PageNumberPaginator};
export {PageNumberHandler as PageNumberQueryHandler};
export {PaginatorError as PaginatorError};

export const paginate = function(request, reqOpts, queryParams) {
  return new PageNumberPaginator(request, reqOpts, queryParams);
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
  LimitOffsetPaginator,
  LimitOffsetQueryHandler: LimitOffsetHandler,
  PageMerger,
  PageNumberPaginator,
  PageNumberQueryHandler: PageNumberHandler,
  paginate,
  PaginatorError
};

export default drfPaginator;
module.exports = drfPaginator;
