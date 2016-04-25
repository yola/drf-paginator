import BasePaginator from './base-paginator';
import PageNumberHandler from '../query-handlers/page-number-query-handler';


export class PageNumberPaginator extends BasePaginator {
  constructor(request, requestOptions, queryParams) {
    super(request, requestOptions);

    var queryHandler = new PageNumberHandler();

    this.setQueryHandler(queryHandler);

    if (queryParams) {
      this.setQueryParams(queryParams);
    }
  }
}

export default PageNumberPaginator;
