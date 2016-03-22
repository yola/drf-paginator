import PageMerger from './page-merger';
import Paginator from './paginator';


export {PageMerger as PageMerger};
export {Paginator as Paginator};

export const all = function(request, reqOpts, queryParams, options) {
  const paginator = new Paginator(request, reqOpts, queryParams, options);
  const pageMerger = new PageMerger(paginator);

  const mergeAllPages = function(pageCount) {
    return pageMerger.merge(1, pageCount);
  };

  return paginator.fetchPageCount()
    .then(mergeAllPages);
};

export const paginate = function(request, reqOpts, queryParams, options) {
  return new Paginator(request, reqOpts, queryParams, options);
};

const drfPaginator = {
  all,
  paginate,
  PageMerger,
  Paginator
};

export default drfPaginator;
module.exports = drfPaginator;
