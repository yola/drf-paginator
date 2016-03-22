import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Promise from 'bluebird';

import Paginator from './paginator';
import * as request from './helpers/request-spy';


const {assert, expect} = chai;

chai.use(chaiAsPromised);

describe('drf-paginator', function() {
  afterEach(function() {
    request.spy.reset();
  });

  describe('Paginator', function() {
    let paginator;

    const getCurrentPage = function() {
      return paginator.page;
    };

    describe('errors', function() {
      it('should be an object', function() {
        expect(Paginator.errors).to.be.an('object');
      });

      it('should be frozen', function() {
        expect(Paginator.errors).to.be.frozen;
      });
    });

    describe('styles', function() {
      it('should be an object', function() {
        expect(Paginator.styles).to.be.an('object');
      });

      it('should be frozen', function() {
        expect(Paginator.styles).to.be.frozen;
      });
    });

    describe('constructor', function() {
      const givenPageNumber = 42;

      beforeEach(function() {
        const queryParams = {
          page: givenPageNumber
        };
        paginator = new Paginator(request.spy, null, queryParams);
      });

      it('sets the page to the given page query parameter', function() {
        expect(paginator.page).to.equal(givenPageNumber);
      });
    });

    describe('constructor', function() {
      const message = Paginator.errors.invalidStyle;
      const style = 'invalid-value';

      it('throws an error when an invalid pagination style is set',
        function() {
          const paginatorConstructor = function() {
            new Paginator(request.spy, null, {}, { style });
          };

          return expect(paginatorConstructor).to.throw(Error, message);
        });
    });

    describe('constructor', function() {
      describe('(LimitOffsetPagination)', function() {
        const style = Paginator.styles.limitOffset;

        it('throws an error when no limit is set and offset isn\'t zero',
          function() {
            const message = Paginator.errors.calculatePageNoLimit;
            const queryParams = { offset: 5 };
            const paginatorConstructor = function() {
              new Paginator(request.spy, null, queryParams, { style });
            };

            return expect(paginatorConstructor).to.throw(Error, message);
          });

        it('doesn\'t throw an error when no limit is set and offset is zero',
          function() {
            const message = Paginator.errors.calculatePageNoLimit;
            const queryParams = { offset: 0 };
            const paginatorConstructor = function() {
              new Paginator(request.spy, null, queryParams, { style });
            };

            return expect(paginatorConstructor).to.not.throw(Error, message);
          });
      });
    });

    describe('page', function() {
      beforeEach(function() {
        paginator = new Paginator(request.spy);
      });

      it('defaults to one', function() {
        expect(paginator.page).to.equal(1);
      });
    });

    describe('next', function() {
      beforeEach(function() {
        paginator = new Paginator(request.spy);
      });

      it('returns a promise that successfully resolves', function() {
        const promise = paginator.next();

        return expect(promise).to.eventually.resolve;
      });

      it('returns a promise with a response instance', function() {
        const response = paginator.next();

        return expect(response).to.eventually.be.an.instanceOf(Response);
      });

      it('increments the current page', function() {
        expect(paginator.page).to.equal(1);

        const currentPage = paginator.next().then(getCurrentPage);

        return expect(currentPage).to.eventually.equal(2);
      });

      it('calls the request given to the paginator', function() {
        const requestCallCount = paginator.next()
          .then(request.getCallCount);

        return expect(requestCallCount).to.eventually.equal(2);
      });
    });

    describe('next', function() {
      before(function() {
        paginator = new Paginator(request.spy, null, { page: 10 });
      });

      it('doesn\'t increment the current page when on the last page',
        function() {
          expect(paginator.page).to.equal(10);

          const currentPage = paginator.next().then(getCurrentPage);

          return expect(currentPage).to.eventually.equal(10);
        });
    });

    describe('prev', function() {
      beforeEach(function() {
        paginator = new Paginator(request.spy, null, { page: 2 });
      });

      it('returns a promise that successfully resolves', function() {
        const promise = paginator.prev();

        return expect(promise).to.eventually.resolve;
      });

      it('returns a promise with a response instance', function() {
        const response = paginator.prev();

        return expect(response).to.eventually.be.an.instanceOf(Response);
      });

      it('decrements the current page', function() {
        expect(paginator.page).to.equal(2);

        const currentPage = paginator.prev().then(getCurrentPage);

        return expect(currentPage).to.eventually.equal(1);
      });

      it('calls the request given to the paginator', function() {
        const requestCallCount = paginator.prev()
          .then(request.getCallCount);

        return expect(requestCallCount).to.eventually.equal(1);
      });
    });

    describe('prev', function() {
      before(function() {
        paginator = new Paginator(request.spy);
      });

      it('doesn\'t decrement the current page when on the first page',
        function() {
          expect(paginator.page).to.equal(1);

          const currentPage = paginator.prev().then(getCurrentPage);

          return expect(currentPage).to.eventually.equal(1);
        });
    });

    describe('first', function() {
      beforeEach(function() {
        paginator = new Paginator(request.spy, null, { page: 3 });
      });

      it('returns a promise that successfully resolves', function() {
        const promise = paginator.first();

        return expect(promise).to.eventually.resolve;
      });

      it('returns a promise with a response instance', function() {
        const response = paginator.first();

        return expect(response).to.eventually.be.an.instanceOf(Response);
      });

      it('sets the current page to the first page ', function() {
        expect(paginator.page).to.equal(3);

        const currentPage = paginator.first().then(getCurrentPage);

        return expect(currentPage).to.eventually.equal(1);
      });

      it('calls the request given to the paginator', function() {
        const requestCallCount = paginator.first()
          .then(request.getCallCount);

        return expect(requestCallCount).to.eventually.equal(1);
      });
    });

    describe('last', function() {
      beforeEach(function() {
        paginator = new Paginator(request.spy);
      });

      it('returns a promise that successfully resolves', function() {
        const promise = paginator.last();

        return expect(promise).to.eventually.resolve;
      });

      it('returns a promise with a response instance', function() {
        const response = paginator.last();

        return expect(response).to.eventually.be.an.instanceOf(Response);
      });

      it('sets the current page to the last page', function() {
        expect(paginator.page).to.equal(1);

        const currentPage = paginator.last().then(getCurrentPage);

        return expect(currentPage).to.eventually.equal(10);
      });

      it('calls the request given to the paginator', function() {
        const requestCallCount = paginator.last()
          .then(request.getCallCount);

        return expect(requestCallCount).to.eventually.equal(2);
      });
    });

    describe('current', function() {
      beforeEach(function() {
        paginator = new Paginator(request.spy);
      });

      it('returns a promise that successfully resolves', function() {
        const promise = paginator.current();

        return expect(promise).to.eventually.resolve;
      });

      it('doesn\'t change the current page', function() {
        expect(paginator.page).to.equal(1);

        const currentPage = paginator.current().then(getCurrentPage);

        return expect(currentPage).to.eventually.equal(1);
      });

      it('calls the request given to the paginator', function() {
        const requestCallCount = paginator.last()
          .then(request.getCallCount);

        return expect(requestCallCount).to.eventually.equal(2);
      });
    });

    describe('fetchPage', function() {
      const getUniqueValue = function(response) {
        return response.json().then((body) => body.__unique__);
      };

      beforeEach(function() {
        paginator = new Paginator(request.spy);
      });

      it('returns a promise that successfully resolves', function() {
        const promise = paginator.fetchPage(1);

        return expect(promise).to.eventually.resolve;
      });

      it('returns a promise with a response instance', function() {
        const response = paginator.fetchPage(1);

        return expect(response).to.eventually.be.an.instanceOf(Response);
      });

      it('calls the request given to the paginator', function() {
        const requestCallCount = paginator.fetchPage(1)
          .then(request.getCallCount);

        return expect(requestCallCount).to.eventually.equal(1);
      });

      it('clone responses', function() {
        const getFirstResponse = paginator.fetchPage(1);
        const getSecondResponse = getFirstResponse
          .then(() => paginator.fetchPage(1));
        const getResponses = Promise.all([
          getFirstResponse,
          getSecondResponse
        ]);

        return getResponses.spread(assert.notStrictEqual);
      });

      it('caches responses', function() {
        const getFirstValue = paginator.fetchPage(1)
          .then(getUniqueValue);
        const getSecondValue = getFirstValue
          .then(() => paginator.fetchPage(1))
          .then(getUniqueValue);
        const getUniqueValues = Promise.all([getFirstValue, getSecondValue]);

        return getUniqueValues.spread(assert.strictEqual);
      });
    });

    describe('fetchPage', function() {
      beforeEach(function() {
        const options = {
          pageQueryParam: 'p'
        };
        paginator = new Paginator(request.spy, null, {}, options);
      });

      it('set the page query parameter using the configured property name',
        function() {
          const queryParams = paginator.fetchPage(1)
            .then(request.getQueryParams);

          return expect(queryParams).to.eventually.have.property('p');
        });
    });

    describe('fetchPage', function() {
      describe('(LimitOffsetPagination)', function() {
        beforeEach(function() {
          const options = {
            limitQueryParam: 'l',
            offsetQueryParam: 'o',
            style: Paginator.styles.limitOffset
          };
          paginator = new Paginator(request.spy, null, {}, options);
        });

        it('set the limit query parameter using the configured property name',
          function() {
            const queryParams = paginator.fetchPage(1)
              .then(request.getQueryParams);

            return expect(queryParams).to.eventually.have.property('l');
          });

        it('set the offset query parameter using the configured property name',
          function() {
            const queryParams = paginator.fetchPage(1)
              .then(request.getQueryParams);

            return expect(queryParams).to.eventually.have.property('o');
          });
      });
    });

    describe('fetchPage', function() {
      describe('(LimitOffsetPagination)', function() {
        const style = Paginator.styles.limitOffset;
        const queryParams = {
          offset: 10,
          limit: 5
        };

        beforeEach(function() {
          paginator = new Paginator(request.spy, null, queryParams, { style });
        });

        it('provides a limit query parameter', function() {
          const queryParams = paginator.fetchPage(1)
            .then(request.getQueryParams);

          return expect(queryParams).to.eventually.have.property('limit');
        });

        it('provides an offset query parameter', function() {
          const queryParams = paginator.fetchPage(1)
            .then(request.getQueryParams);

          return expect(queryParams).to.eventually.have.property('offset');
        });

        it('doesn\'t provide a page query parameter', function() {
          const queryParams = paginator.fetchPage(1)
            .then(request.getQueryParams);

          return expect(queryParams).to.eventually.not.have.property('page');
        });

        it('calulates the offset based on the given page', function() {
          const offset = paginator.fetchPage(4)
            .then(request.getOffset);

          return expect(offset).to.eventually.equal(15);
        });
      });
    });

    describe('fetchPageCount', function() {
      beforeEach(function() {
        paginator = new Paginator(request.spy);
      });

      it('returns a promise that successfully resolves', function() {
        const promise = paginator.fetchPageCount();

        return expect(promise).to.eventually.resolve;
      });

      it('returns a promise with the paginator\'s page count', function() {
        const pageCount = paginator.fetchPageCount();

        return expect(pageCount).to.eventually.equal(10);
      });
    });

    describe('clone', function() {
      beforeEach(function() {
        paginator = new Paginator(request.spy);
      });

      it('returns a paginator instance', function() {
        const paginatorClone = paginator.clone();

        return expect(paginatorClone).to.be.an.instanceOf(Paginator);
      });

      it('returns a new paginator', function() {
        const paginatorClone = paginator.clone();

        return expect(paginatorClone).to.not.equal(paginator);
      });

      it('uses the same request function in the paginator clone', function() {
        const paginatorClone = paginator.clone();
        const requestCallCount = paginator.current()
          .then(() => paginatorClone.current())
          .then(request.getCallCount);

        return expect(requestCallCount).to.eventually.equal(2);
      });
    });
  });
});
