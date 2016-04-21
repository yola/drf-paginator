import assign from 'lodash.assign';
import sinon from 'sinon';

import pageNumberResponse from 'src/fixtures/page-number-response.json';


export const request = function(options, queryParams) {
  const uniqueValue = Math.random();
  const response = assign({}, pageNumberResponse, { uniqueValue });

  return Promise.resolve(response);
};

export const spy = sinon.spy(request);

export const getCallCount = function() {
  return spy.callCount;
};
