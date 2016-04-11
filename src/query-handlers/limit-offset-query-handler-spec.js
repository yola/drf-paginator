import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import {LimitOffsetQueryHandler, errors} from './limit-offset-query-handler';
import PaginatorError from 'src/paginator-error';

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

        it('throws an error when a limit hasen\'t been set', function() {
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
