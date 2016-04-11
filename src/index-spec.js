import chai from 'chai';

import drfp from 'src';
import PageNumberPaginator from 'src/paginators/page-number-paginator.js';
import * as request from 'src/helpers/request-spy';


const {expect} = chai;

describe('drf-paginator', function() {
  afterEach(function() {
    request.spy.reset();
  });

  it('should export paginators', function() {
    expect(drfp.paginators).to.exist;
  });

  it('should export queryHandlers', function() {
    expect(drfp.queryHandlers).to.exist;
  });

  it('should export PageMerger', function() {
    expect(drfp.PageMerger).to.exist;
  });

  it('should export PaginatorError', function() {
    expect(drfp.PaginatorError).to.exist;
  });

  describe('paginate', function() {
    it('returns a new paginator for the given request', function() {
      const paginator = drfp.paginate(request);

      expect(paginator).to.be.an.instanceOf(PageNumberPaginator);
    });
  });

  describe('all', function() {
    it('returns a promise that successfully resolves', function() {
      const promise = drfp.all(request.spy);

      return expect(promise).to.eventually.resolve;
    });

    it('returns a promise with a response object', function() {
      const response = drfp.all(request.spy);

      return expect(response).to.eventually.be.an('object');
    });

    it('calls the request to fetch each page', function() {
      const pageCount = 10;
      const requestCallCount = drfp.all(request.spy)
        .then(request.getCallCount);

      return expect(requestCallCount).to.eventually.equal(pageCount);
    });

    it('accepts a paginator as the only argument', function() {
      const paginator = new PageNumberPaginator(request.spy);
      const promise = drfp.all(paginator);

      return expect(promise).to.eventually.resolve;
    });
  });
});
