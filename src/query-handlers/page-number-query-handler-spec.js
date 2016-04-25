import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import QueryHandler from './page-number-query-handler';


const {expect} = chai;

chai.use(chaiAsPromised);

describe('drf-paginator', function() {
  describe('queryHandlers', function() {
    describe('PageNumberQueryHandler', function() {
      let handler;

      beforeEach(function() {
        handler = new QueryHandler();
      });

      describe('makeParams', function() {
        it('returns query parameters', function() {
          const queryParams = handler.makeParams(42);

          expect(queryParams).to.be.an('object');
        });

        it('determines the page parameter based on the given page number',
          function() {
            const queryParams = handler.makeParams(42);

            expect(queryParams.page).to.equal(42);
          });

        it('uses the configured page parameter name', function() {
          handler.setOptions({ pageQueryParam: 'p' });

          const params = handler.makeParams(42);

          expect(params.p).to.equal(42);
        });

        it('integrates the set parameters into the output', function() {
          handler.setParams({ hello: 'world' });

          const queryParams = handler.makeParams(42);

          expect(queryParams.hello).to.equal('world');
        });
      });

      describe('resolvePage', function() {
        it('returns a page number determined by the given parameters',
          function() {
            const page = handler.resolvePage({ page: 2 });

            expect(page).to.equal(2);
          });
      });

      describe('setParams', function() {
        it('is a fluent method', function() {
          var result = handler.setParams({ hello: 'world' });

          expect(result).to.equal(handler);
        });
      });

      describe('setOptions', function() {
        it('is a fluent method', function() {
          var result = handler.setOptions({ hello: 'world' });

          expect(result).to.equal(handler);
        });
      });
    });
  });
});
