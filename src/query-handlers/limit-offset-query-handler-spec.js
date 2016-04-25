import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import {LimitOffsetQueryHandler, errors} from './limit-offset-query-handler';
import PaginatorError from '../paginator-error';

const {expect} = chai;

chai.use(chaiAsPromised);

describe('drf-paginator', function() {
  describe('queryHandlers', function() {
    describe('LimitOffsetQueryHandler', function() {
      let handler;

      beforeEach(function() {
        handler = new LimitOffsetQueryHandler();
      });

      describe('makeParams', function() {
        it('returns query parameters', function() {
          handler.setParams({ limit: 500 });

          const queryParams = handler.makeParams(42);

          expect(queryParams).to.be.an('object');
        });

        it('throws an error when a limit hasn\'t been set', function() {
          handler.setParams({ limit: null });

          const check = () => handler.makeParams(42);

          expect(check).to.throw(PaginatorError, errors.CalculateOffsetNoLimit);
        });

        it('doesn\'t throw an error for a limit when the page is one',
          function() {
            handler.setParams({ limit: null });

            const check = () => handler.makeParams(1);

            expect(check).to.not.throw(PaginatorError);
          });

        it('determines the offset parameter based on the given page number',
          function() {
            handler.setParams({ limit: 500 });

            const queryParams = handler.makeParams(42);

            expect(queryParams.offset).to.equal(20500);
          });

        it('determines the limit parameter based on the set limit',
          function() {
            handler.setParams({ limit: 500 });

            const queryParams = handler.makeParams(42);

            expect(queryParams.limit).to.equal(500);
          });

        it('uses the configured offset parameter name', function() {
          handler.setOptions({ offsetQueryParam: 'o' });
          handler.setParams({ limit: 500 });

          const params = handler.makeParams(42);

          expect(params.o).to.equal(20500);
        });

        it('uses the configured limit parameter name', function() {
          handler.setOptions({ limitQueryParam: 'l' });
          handler.setParams({ l: 500 });

          const params = handler.makeParams(42);

          expect(params.l).to.equal(500);
        });

        it('integrates the set parameters into the output', function() {
          handler.setParams({
            limit: 500,
            hello: 'world'
          });

          const queryParams = handler.makeParams(42);

          expect(queryParams.hello).to.equal('world');
        });
      });

      describe('resolvePage', function() {
        it('returns a page number determined by the given parameters',
          function() {
            const page = handler.resolvePage({
              limit: 500,
              offset: 20500
            });

            expect(page).to.equal(42);
          });

        it('throws an error if no limit is given',
          function() {
            const check = function() {
              handler.resolvePage({
                offset: 20500
              });
            };

            expect(check).to.throw(PaginatorError);
          });

        it('resolves the first page without a limit being set',
          function() {
            const page = handler.resolvePage({
              offset: 0
            });

            expect(page).to.equal(1);
          });
      });

      describe('setParams', function() {
        it('is a fluent method', function() {
          var result = handler.setParams({ hello: 'world' });

          expect(result).to.equal(handler);
        });
      });

      describe('onResponse', function() {
        it('sets the limit query parameter if missing', function() {
          const response = {
            count: 10,
            results: Array(2)
          };
          const page = 1;

          handler.onResponse(response, page);

          const queryParams = handler.makeParams(1);

          expect(queryParams.limit).to.equal(2);
        });

        it('doesn\'t set the limit query parameter if the page isn\'t one',
          function() {
            const response = {
              count: 10,
              results: Array(2)
            };
            const page = 2;

            handler.onResponse(response, page);

            const queryParams = handler.makeParams(1);

            expect(queryParams.limit).to.be.null;
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
