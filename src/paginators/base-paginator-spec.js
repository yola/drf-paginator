import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {BasePaginator, errors} from './base-paginator';
import PaginatorError from '../paginator-error';
import * as queryHandler from '../helpers/query-handler-stub';
import * as request from '../helpers/request-spy';


const {assert, expect} = chai;

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('drf-paginator', function() {
  afterEach(function() {
    request.spy.reset();
    queryHandler.resetSpies();
  });

  describe('BasePaginator', function() {
    let paginator;

    const makePaginator = function(queryParams) {
      paginator = new BasePaginator(request.spy)
        .setQueryHandler(queryHandler.stub);

      if (queryParams) {
        paginator.setQueryParams(queryParams);
      }
    };

    describe('page', function() {
      beforeEach(function() {
        makePaginator();
      });

      it('defaults to zero', function() {
        expect(paginator.page).to.equal(0);
      });
    });

    describe('queryHandler', function() {
      beforeEach(function() {
        paginator = new BasePaginator(request.spy);
      });

      it('defaults to `null`', function() {
        expect(paginator.page).to.equal(0);
      });
    });

    describe('next', function() {
      beforeEach(function() {
        makePaginator();
      });

      it('returns a promise that resolves', function() {
        const promise = paginator.next();

        return expect(promise).to.eventually.resolve;
      });

      it('returns a promise with a response object', function() {
        const response = paginator.next();

        return expect(response).to.eventually.be.an('object');
      });

      it('increments the page', function() {
        expect(paginator.page).to.equal(0);

        const page = paginator.next()
          .then(() => paginator.page);

        return expect(page).to.eventually.equal(1);
      });

      it('sends a request using the request function', function() {
        const requestCallCount = paginator.next()
          .then(request.getCallCount);

        return expect(requestCallCount).to.eventually.equal(1);
      });
    });

    describe('prev', function() {
      beforeEach(function() {
        makePaginator({ page: 2 });
      });

      it('returns a promise that resolves', function() {
        const promise = paginator.prev();

        return expect(promise).to.eventually.resolve;
      });

      it('returns a promise with a response object', function() {
        const response = paginator.prev();

        return expect(response).to.eventually.be.an('object');
      });

      it('decrements the page', function() {
        expect(paginator.page).to.equal(2);

        const page = paginator.prev()
          .then(() => paginator.page);

        return expect(page).to.eventually.equal(1);
      });

      it('sends a request using the request function', function() {
        const requestCallCount = paginator.prev()
          .then(request.getCallCount);

        return expect(requestCallCount).to.eventually.equal(1);
      });
    });

    describe('first', function() {
      beforeEach(function() {
        makePaginator();
      });

      it('returns a promise that resolves', function() {
        const promise = paginator.first();

        return expect(promise).to.eventually.resolve;
      });

      it('returns a promise with a response object', function() {
        const response = paginator.first();

        return expect(response).to.eventually.be.an('object');
      });

      it('sets the page to the first page ', function() {
        expect(paginator.page).to.equal(0);

        const page = paginator.first()
          .then(() => paginator.page);

        return expect(page).to.eventually.equal(1);
      });

      it('sends a request using the request function', function() {
        const requestCallCount = paginator.first()
          .then(request.getCallCount);

        return expect(requestCallCount).to.eventually.equal(1);
      });
    });

    describe('last', function() {
      beforeEach(function() {
        makePaginator();
      });

      it('returns a promise that resolves', function() {
        const promise = paginator.last();

        return expect(promise).to.eventually.resolve;
      });

      it('returns a promise with a response object', function() {
        const response = paginator.last();

        return expect(response).to.eventually.be.an('object');
      });

      it('sets the paginator\'s current page to the last page', function() {
        expect(paginator.page).to.equal(0);

        const page = paginator.last()
          .then(() => paginator.page);

        return expect(page).to.eventually.equal(10);
      });

      it('sends requests to get the page count and the last page.',
        function() {
          const requestCallCount = paginator.last()
            .then(request.getCallCount);

          return expect(requestCallCount).to.eventually.equal(2);
        });
    });

    describe('current', function() {
      beforeEach(function() {
        makePaginator({ page: 1 });
      });

      it('returns a promise that resolves', function() {
        const promise = paginator.current();

        return expect(promise).to.eventually.resolve;
      });

      it('doesn\'t change the page', function() {
        expect(paginator.page).to.equal(1);

        const page = paginator.current()
          .then(() => paginator.page);

        return expect(page).to.eventually.equal(1);
      });

      it('sends a request using the request function', function() {
        const requestCallCount = paginator.current()
          .then(request.getCallCount);

        return expect(requestCallCount).to.eventually.equal(1);
      });
    });

    describe('fetchPage', function() {
      beforeEach(function() {
        makePaginator();
      });

      it('returns a promise that resolves', function() {
        const promise = paginator.fetchPage(1);

        return expect(promise).to.eventually.resolve;
      });

      it('returns a promise with a response object', function() {
        const response = paginator.fetchPage(1);

        return expect(response).to.eventually.be.an('object');
      });

      it('sends a request using the request function', function() {
        const requestCallCount = paginator.fetchPage(1)
          .then(request.getCallCount);

        return expect(requestCallCount).to.eventually.equal(1);
      });

      it('returns a rejected promise for pages before the first page',
        function() {
          const promise = paginator.fetchPage(0);

          return expect(promise).to.eventually.be.rejectedWith(Error);
        });

      it('rejects pages after the last page when the page count is known',
        function() {
          // The max page of the fixture is 10
          const promise = paginator.fetchPageCount()
            .then(() => paginator.fetchPage(13));

          return expect(promise).to.eventually.be.rejectedWith(Error);
        });

      it('accepts pages after the last page when the page count is unknown',
        function() {
          const promise = paginator.fetchPage(13);

          return expect(promise).to.eventually.resolve;
        });

      it('clone responses', function() {
        const first = paginator.fetchPage(1);
        const second = first.then(() => paginator.fetchPage(1));

        return Promise.all([first, second])
          .spread(assert.notStrictEqual);
      });

      it('caches requests', function() {
        const first = paginator.fetchPage(1)
          .then((res) => res.uniqueValue);
        const second = first.then(() => paginator.fetchPage(1))
          .then((res) => res.uniqueValue);

        return Promise.all([first, second])
          .spread(assert.strictEqual);
      });

      it('calls the query handler\'s `onResponse` method', function() {
        const onResponseCallCount = paginator.fetchPage(1)
          .then(() => queryHandler.stub.onResponse.callCount);

        return expect(onResponseCallCount).to.eventually.equal(1);
      });

      it('throws an error if the query handler isn\'t set', function() {
        paginator.queryHandler = null;

        const check = function() {
          paginator.fetchPage(1);
        };
        const msg = errors.queryHandlerMissing;

        return expect(check).to.throw(PaginatorError, msg);
      });
    });

    describe('fetchPageCount', function() {
      beforeEach(function() {
        makePaginator();
        sinon.spy(paginator, 'fetchPage');
      });

      afterEach(function() {
        paginator.fetchPage.restore();
      });

      it('returns a promise that resolves', function() {
        const promise = paginator.fetchPageCount();

        return expect(promise).to.eventually.resolve;
      });

      it('returns a promise with the paginator\'s page count', function() {
        const pageCount = paginator.fetchPageCount();

        return expect(pageCount).to.eventually.equal(10);
      });

      it('caches the page count', function() {
        const fetchPageCallCount = paginator.fetchPageCount()
          .then(() => paginator.fetchPageCount())
          .then(() => paginator.fetchPage.callCount);

        return expect(fetchPageCallCount).to.eventually.equal(1);
      });
    });

    describe('setQueryHandler', function() {
      beforeEach(function() {
        paginator = new BasePaginator(request.spy);
      });

      it('sets the query handler', function() {
        const obj = {};

        paginator.setQueryHandler(obj);

        expect(paginator.queryHandler).to.equal(obj);
      });

      it('is a fluent method', function() {
        var result = paginator.setQueryHandler({});

        expect(result).to.equal(paginator);
      });
    });

    describe('setQueryParams', function() {
      beforeEach(function() {
        makePaginator();
      });

      it('sets the parameters in the query handler', function() {
        const queryParams = { page: 42 };

        paginator.setQueryParams(queryParams);

        expect(paginator.queryHandler.setParams)
          .to.have.been.calledWithMatch(queryParams);
      });

      it('updates the paginator\'s page based on the given parameters',
        function() {
          expect(paginator.page).to.equal(0);

          paginator.setQueryParams({ page: 42 });

          expect(paginator.page).to.equal(42);
        });

      it('is a fluent method', function() {
        var result = paginator.setQueryParams({});

        expect(result).to.equal(paginator);
      });
    });
  });
});
