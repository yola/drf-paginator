import cloneDeep from 'lodash.clonedeep';

import * as actions from 'src/actions';
import PaginatorError from 'src/paginator-error';


export const errors = Object.freeze({
  queryHandlerMissing: 'A query handler must be set to generate parameters'
});

export class BasePaginator {
  constructor(request, requestOptions = null) {
    this._cache = Object.create(null);
    this._page = 0;
    this._request = request;
    this._requestOptions = cloneDeep(requestOptions);
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
        .then(cloneDeep);
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

    return request.then(cloneDeep);
  }

  fetchPageCount() {
    if (this._pageCount) {
      return Promise.resolve(this._pageCount);
    }

    var setPageCount = (parsed) => {
      this._pageCount = parsed.pageCount;
    };

    return this.fetchPage(1)
      .then(actions.parseResponse)
      .then(setPageCount)
      .then(() => this._pageCount);
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
    return Promise.reject({
      detail: `Invalid page "${page}".`
    });
  }

  _sendRequest(page) {
    if (!this.queryHandler) {
      throw new PaginatorError(errors.queryHandlerMissing);
    }

    const requestOptions = cloneDeep(this._requestOptions);
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
