import BasePaginator from 'src/paginators/base-paginator';
import QueryHandler from 'src/query-handlers/limit-offset-query-handler';


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
