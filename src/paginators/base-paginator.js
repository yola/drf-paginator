import _ from 'lodash';

import * as actions from '../actions';
import PaginatorError from '../paginator-error';


export const errors = Object.freeze({
  queryHandlerMissing: 'A query handler must be set to generate parameters'
});

export class BasePaginator {
  constructor(request, requestOptions = null) {
    this._cache = Object.create(null);
    this._page = 0;
    this._request = request;
    this._requestOptions = _.cloneDeep(requestOptions);
    this.queryHandler = null;
  }

  get page() {
    return this._page;
  }

  current() {
    return this.fetchPage(this._page);
  }

  next() {
    return this.fetchPage(++this._page);
  }

  prev() {
    return this.fetchPage(--this._page);
  }

  first() {
    return this.fetchPage(this._page = 1);
  }

  last() {
    const fetchLastPage = (pageCount) => {
      return this.fetchPage(this._page = pageCount);
    };

    return this.fetchPageCount()
      .then(fetchLastPage);
  }

  fetchPage(page) {
    if (this._hasRequest(page)) {
      return this._getRequest(page)
        .then(_.cloneDeep);
    }

    if (!this._isValidPage(page)) {
      return this._rejectPage(page);
    }

    const handleResponse = (response) => {
      return this._handleResponse(response, page);
    };

    const request = this._sendRequest(page)
      .then(handleResponse);

    this._cacheRequest(page, request);

    return request.then(_.cloneDeep);
  }

  fetchPageCount() {
    if (this._pageCount) {
      return Promise.resolve(this._pageCount);
    }

    var setPageCount = (pageCount) => {
      this._pageCount = pageCount;

      return pageCount;
    };

    return this.fetchPage(1)
      .then(actions.inferPageCount)
      .then(setPageCount);
  }

  setQueryHandler(queryHandler) {
    this.queryHandler = queryHandler;

    return this;
  }

  setQueryParams(queryParams) {
    this.queryHandler.setParams(queryParams);
    this._page = this.queryHandler.resolvePage(queryParams);

    return this;
  }

  _isValidPage(page) {
    return page >= 1 && (this._pageCount ? page <= this._pageCount : true);
  }

  _rejectPage(page) {
    const message = `Invalid page "${page}".`;
    const error = new Error(message);
    error.response = { detail: message };

    return Promise.reject(error);
  }

  _sendRequest(page) {
    if (!this.queryHandler) {
      throw new PaginatorError(errors.queryHandlerMissing);
    }

    const requestOptions = _.cloneDeep(this._requestOptions);
    const queryParams = this.queryHandler.makeParams(page);

    return this._request(requestOptions, queryParams);
  }

  _cacheRequest(page, response) {
    this._cache[page] = response;
  }

  _getRequest(page) {
    return this._cache[page];
  }

  _hasRequest(page) {
    return !!this._cache[page];
  }

  _handleResponse(response, page) {
    if (this.queryHandler.onResponse) {
      this.queryHandler.onResponse(response, page);
    }

    return response;
  }
}

export default BasePaginator;
