import assign from 'lodash.assign';
import sinon from 'sinon';

import limitOffsetResponse from 'src/fixtures/limit-offset-response.json';
import pageNumberResponse from 'src/fixtures/page-number-response.json';


export const request = function(options, queryParams) {
  const uniqueValue = Math.random();
  let fixture;

  if (queryParams.hasOwnProperty('page')) {
    fixture = pageNumberResponse;
  } else {
    fixture = limitOffsetResponse;
  }

  const response = assign({}, fixture, { uniqueValue });

  return Promise.resolve(response);
};

export const spy = sinon.spy(request);

export const getArgs = function() {
  const args = spy.args;
  return args[args.length - 1];
};

export const getCallCount = function() {
  return spy.callCount;
};

export const getOptions = function() {
  return getArgs()[0];
};

export const getQueryParams = function() {
  return getArgs()[1];
};

export const getOffset = function() {
  return getQueryParams().offset;
};

export const getPage = function() {
  return getQueryParams().page;
};
