import BasePaginator from './base-paginator';
import QueryHandler from '../query-handlers/limit-offset-query-handler';


export class LimitOffsetPaginator extends BasePaginator {
  constructor(request, requestOptions, queryParams) {
    super(request, requestOptions);

    var queryHandler = new QueryHandler();

    this.setQueryHandler(queryHandler);

    if (queryParams) {
      this.setQueryParams(queryParams);
    }
  }
}

export default LimitOffsetPaginator;
