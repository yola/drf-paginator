import assign from 'lodash.assign';
import sinon from 'sinon';


const limitOffsetResponse = require('../fixtures/limit-offset-response.json');
const pageNumberResponse = require('../fixtures/page-number-response.json');

const state = {
  status: 200,
  statusText: 'Success',
  headers: {
    'Content-Type': 'application/json'
  }
};

export const request = function(options, queryParams) {
  const fixture = queryParams.page ? pageNumberResponse : limitOffsetResponse;
  let body = assign({}, fixture);
  body.__unique__ = Math.random();
  body = JSON.stringify(body);
  const response = new Response(body, state);

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
