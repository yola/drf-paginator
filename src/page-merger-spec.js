import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import PageMerger from './page-merger';
import Paginator from './paginator';
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

      const getResponseBody = function(response) {
        return response.json();
      };

      beforeEach(function() {
        const paginator = new Paginator(request.spy);
        pageMerger = new PageMerger(paginator);
      });

      it('returns a promise that successfully resolves', function() {
        const promsie = pageMerger.merge(1, pageCount);

        return expect(promsie).to.eventually.resolve;
      });

      it('returns a promise with a response instance', function() {
        const response = pageMerger.merge(1, pageCount);

        return expect(response).to.eventually.be.an.instanceOf(Response);
      });

      it('returns a promise with an object containing results', function() {
        const results = pageMerger.merge(1, pageCount)
          .then(getResponseBody)
          .then((body) => body.results);

        return expect(results).to.eventually.be.an('array');
      });

      it('returns a promise with an object containing the count', function() {
        const count = pageMerger.merge(1, pageCount)
          .then(getResponseBody)
          .then((body) => body.count);

        return expect(count).to.eventually.equal(50);
      });

      it('calls the request to fetch each page', function() {
        const requestCallCount = pageMerger.merge(1, pageCount)
          .then(request.getCallCount);

        return expect(requestCallCount).to.eventually.equal(pageCount);
      });
    });
  });
});
