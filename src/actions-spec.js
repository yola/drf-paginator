import chai from 'chai';

import actions from 'src/actions';


const {expect} = chai;

describe('drf-paginator', function() {
  const response = {
    count: 0,
    results: []
  };

  describe('actions', function() {
    it('should export inferLimit', function() {
      expect(actions.inferLimit).to.exist;
    });

    it('should export inferPageCount', function() {
      expect(actions.inferPageCount).to.exist;
    });

    describe('inferLimit', function() {
      it('returns NULL when it can\'t determine the limit', function() {
        const result = actions.inferLimit(response);

        expect(result).to.be.null;
      });
    });

    describe('inferPageCount', function() {
      it('returns `1` when it can\'t determine the page count', function() {
        const pageCount = actions.inferPageCount(response);

        expect(pageCount).to.equal(1);
      });
    });
  });
});
