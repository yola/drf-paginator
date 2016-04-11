import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import BasePaginator from 'src/paginators/base-paginator';
import Paginator from 'src/paginators/limit-offset-paginator';
import QueryHandler from 'src/query-handlers/limit-offset-query-handler';
import * as request from 'src/helpers/request-spy';


const {expect} = chai;

chai.use(chaiAsPromised);

describe('drf-paginator', function() {
  describe('LimitOffsetPaginator', function() {
    it('extends the base paginator', function() {
      const paginator = new Paginator(request.spy);

      expect(paginator)
        .to.be.an.instanceOf(BasePaginator);
    });

    describe('constructor', function() {
      it('sets the query handler to a limit-offset',
        function() {
          const paginator = new Paginator(request.spy);

          expect(paginator.queryHandler)
            .to.be.an.instanceOf(QueryHandler);
        });

      it('sets the given query parameters', function() {
        const queryParams = {
          limit: 500,
          offset: 20500
        };
        const paginator = new Paginator(request.spy, null, queryParams);

        expect(paginator.page).to.equal(42);
      });
    });
  });
});
