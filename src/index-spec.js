import chai from 'chai';

import drfp from './index';
import * as request from './helpers/request-spy';


const expect = chai.expect;

describe('drf-paginator', function() {
  afterEach(function() {
    request.spy.reset();
  });

  it('should export PageMerger', function() {
    expect(drfp.PageMerger).to.exist;
  });

  it('should export Paginator', function() {
    expect(drfp.Paginator).to.exist;
  });

  describe('paginate', function() {
    it('returns a new paginator for the given request', function() {
      const paginator = drfp.paginate(request);

      expect(paginator).to.be.an.instanceOf(drfp.Paginator);
    });
  });

  describe('all', function() {
    it('returns a promise that successfully resolves', function() {
      const promsie = drfp.all(request.spy);

      return expect(promsie).to.eventually.resolve;
    });

    it('returns a promise with a response instance', function() {
      const response = drfp.all(request.spy);

      return expect(response).to.eventually.be.an.instanceOf(Response);
    });

    it('calls the request to fetch each page', function() {
      const pageCount = 10;
      const requestCallCount = drfp.all(request.spy)
        .then(request.getCallCount);

      return expect(requestCallCount).to.eventually.equal(pageCount);
    });
  });
});
