import chai from 'chai';

import actions from 'src/actions';


const {expect} = chai;

describe('drf-paginator', function() {
  const response = {
    count: 0,
    results: []
  };

  describe('actions', function() {
    it('should export inferResponseLimit', function() {
      expect(actions.inferResponseLimit).to.exist;
    });

    it('should export parseResponse', function() {
      expect(actions.parseResponse).to.exist;
    });

    describe('inferResponseLimit', function() {
      it('returns NULL when it can\'t determine the limit', function() {
        const result = actions.inferResponseLimit(response);

        expect(result).to.be.null;
      });
    });

    describe('parseResponse', function() {
      it('parses responses', function() {
        const result = actions.parseResponse(response);

        const expectedResult = {
          count: 0,
          limit: null,
          pageCount: 1,
          results: response.results
        };

        expect(result).to.eql(expectedResult);
      });
    });
  });
});