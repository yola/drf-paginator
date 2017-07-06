import _ from 'lodash';
import sinon from 'sinon';

import pageNumberResponse from '../fixtures/page-number-response.json';


export const request = function(options, queryParams) {
  const uniqueValue = Math.random();
  const response = _.assign({}, pageNumberResponse, { uniqueValue });

  return Promise.resolve(response);
};

export const spy = sinon.spy(request);

export const getCallCount = function() {
  return spy.callCount;
};
