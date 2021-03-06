import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import PageMerger from './page-merger';
import PageNumberPaginator from './paginators/page-number-paginator';
import * as request from './helpers/request-spy';


const {expect} = chai;

chai.use(chaiAsPromised);

describe('drf-paginator', function() {
  afterEach(function() {
    request.spy.reset();
  });

  describe('PageMerger', function() {
    describe('merge', function() {
      const pageCount = 10;
      let pageMerger;

      beforeEach(function() {
        const paginator = new PageNumberPaginator(request.spy);
        pageMerger = new PageMerger(paginator);
      });

      it('returns a promise that successfully resolves', function() {
        const promise = pageMerger.merge(1, pageCount);

        return expect(promise).to.eventually.resolve;
      });

      it('returns a promise with a response object', function() {
        const response = pageMerger.merge(1, pageCount);

        return expect(response).to.eventually.be.an('object');
      });

      it('returns a promise with an object containing results', function() {
        const results = pageMerger.merge(1, pageCount)
          .then((response) => response.results);

        return expect(results).to.eventually.be.an('array');
      });

      it('returns a promise with an object containing the count', function() {
        const count = pageMerger.merge(1, pageCount)
          .then((response) => response.count);

        return expect(count).to.eventually.equal(50);
      });

      it('sends requests to fetch pages', function() {
        const requestCallCount = pageMerger.merge(1, pageCount)
          .then(request.getCallCount);

        return expect(requestCallCount).to.eventually.equal(pageCount);
      });
    });
  });
});
