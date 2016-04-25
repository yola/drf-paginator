import chai from 'chai';

import PaginatorError from './paginator-error';


const {expect} = chai;

describe('drf-paginator', function() {
  describe('PaginatorError', function() {
    it('extends `Error`', function() {
      const error = new PaginatorError();

      expect(error).to.be.an.instanceOf(Error);
    });

    it('accepts a message', function() {
      const error = new PaginatorError('message');

      expect(error.message).to.equal('message');
    });
  });
});
