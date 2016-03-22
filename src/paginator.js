import assign from 'lodash.assign';
import omit from 'lodash.omit';


export const styles = Object.freeze({
  pageNumber: 1,
  limitOffset: 2,
});

export const errors = Object.freeze({
  invalidStyle: 'Invalid pagination style',
  calculateOffsetNoLimit: 'Can\'t calculate offsets without a limit',
  calculatePageNoLimit: 'Can\'t calculate pages without a limit'
});

const getResponseBody = function(response) {
  return response.json();
};

const defaultOptions = {
  limitQueryParam: 'limit',
  offsetQueryParam: 'offset',
  pageQueryParam: 'page',
  style: styles.pageNumber
};

const defaultQueryParams = {
  limit: null,
  offset: 0,
  page: 1
};

export class Paginator {
  constructor(request, requestOptions = null, queryParams = {}, options = {}) {
    this._cache = Object.create(null);
    this._parsedResponse = null;
    this._request = request;
    this._requestOptions = assign({}, requestOptions);

    this._setOptions(options);
    this._setQueryParams(queryParams);
  }

  get page() {
    return this._page;
  }

  next() {
    const incrementPage = (pageCount) => {
      if (this._page < pageCount) {
        this._page++;
      }
    };

    return this.fetchPageCount()
      .then(incrementPage)
      .then(() => this.current());
  }

  prev() {
    if (this._page > 1) {
      this._page--;
    }

    return this.current();
  }

  first() {
    this._page = 1;

    return this.current();
  }

  last() {
    const setLastPage = (pageCount) => {
      this._page = pageCount;
    };

    return this.fetchPageCount()
      .then(setLastPage)
      .then(() => this.current());
  }

  current() {
    return this.fetchPage(this._page);
  }

  fetchPage(page) {
    if (this._hasResponse(page)) {
      const response = this._getResponse(page);

      return Promise.resolve(response.clone());
    }

    const request = this._sendRequest(page);
    const cacheResponse = (response) => {
      this._cacheResponse(page, response);
    };
    const makeResponseClone = function() {
      return request.then((res) => res.clone());
    };
    const parseResponse = this._parseResponse.bind(this);
    const setLimitIfMissing = (parsed) => {
      if (!this._limit) {
        this._limit = parsed.limit;
      }
    };

    return request
      .then(cacheResponse)
      .then(makeResponseClone)
      .then(getResponseBody)
      .then(parseResponse)
      .then(setLimitIfMissing)
      .then(makeResponseClone);
  }

  fetchPageCount() {
    return this._fetchParsedResponse()
      .then((parsed) => parsed.pageCount);
  }

  clone(page = 1) {
    const req = this._request;
    const reqOpts = this._requestOptions;
    const queryParams = this._makeQueryParams(page);
    const opts = this._options;

    return new Paginator(req, reqOpts, queryParams, opts);
  }

  _sendRequest(page) {
    const requestOptions = assign({}, this._requestOptions);
    const queryParams = this._makeQueryParams(page);

    return this._request(requestOptions, queryParams);
  }

  _makeQueryParams(page) {
    const options = this._options;
    const queryParams = assign({}, this._extraQueryParams);

    switch (options.style) {
      case styles.pageNumber:
        queryParams[options.pageQueryParam] = page;
        break;
      case styles.limitOffset:
        queryParams[options.limitQueryParam] = this._limit;
        queryParams[options.offsetQueryParam] = this._calculateOffset(page);
        break;
      default:
        throw new Error(errors.invalidStyle);
    }

    return queryParams;
  }

  _getResponse(page) {
    return this._cache[page];
  }

  _cacheResponse(page, response) {
    this._cache[page] = response;
  }

  _hasResponse(page) {
    return !!this._cache[page];
  }

  _fetchParsedResponse(page = 1) {
    if (this._parsedResponse) {
      return this._parsedResponse;
    }

    const parseResponse = this._parseResponse.bind(this);

    this._parsedResponse = this.fetchPage(page)
      .then(getResponseBody)
      .then(parseResponse);

    return this._parsedResponse;
  }

  _parseResponse(responseBody) {
    const {count, results} = responseBody;
    const limit = this._inferLimit(responseBody);
    let pageCount = 1;

    if (count && limit) {
      pageCount = Math.ceil(count / limit);
    }

    return {
      count,
      limit,
      pageCount,
      results
    };
  }

  _setOptions(options) {
    this._options = assign({}, defaultOptions, options);
  }

  _setQueryParams(raw) {
    const parsed = this._parseQueryParams(raw);

    this._limit = parsed.limit;
    this._extraQueryParams = parsed.extra;

    switch (this._options.style) {
      case styles.pageNumber:
        this._page = parsed.page;
        break;
      case styles.limitOffset:
        this._page = this._calculatePage(parsed.offset);
        break;
      default:
        throw new Error(errors.invalidStyle);
    }
  }

  _filterQueryParams(queryParams) {
    const options = this._options;
    const paginatorProperties = [
      options.limitQueryParam,
      options.offsetQueryParam,
      options.pageQueryParam
    ];

    return omit(queryParams, paginatorProperties);
  }

  _parseQueryParams(raw) {
    const {
      limitQueryParam,
      offsetQueryParam,
      pageQueryParam
    } = this._options;

    const parsed = assign({}, defaultQueryParams);

    if (raw.hasOwnProperty(limitQueryParam)) {
      parsed.limit = raw[limitQueryParam];
    }
    if (raw.hasOwnProperty(offsetQueryParam)) {
      parsed.offset = raw[offsetQueryParam];
    }
    if (raw.hasOwnProperty(pageQueryParam)) {
      parsed.page = raw[pageQueryParam];
    }

    parsed.extra = this._filterQueryParams(raw);

    return parsed;
  }

  _calculateOffset(page) {
    const limit = this._limit;

    if (page === 1) {
      return 0;
    }
    if (!limit) {
      throw new Error(errors.calculateOffsetNoLimit);
    }

    return limit * page - limit;
  }

  _calculatePage(offset) {
    const limit = this._limit;

    if (offset === 0) {
      return 1;
    }
    if (!limit) {
      throw new Error(errors.calculatePageNoLimit);
    }

    return (offset + limit) / limit;
  }

  _inferLimit(responseBody) {
    const count = responseBody.count;
    const resultCount = responseBody.results.length;

    if (count > resultCount) {
      return resultCount;
    }

    return null;
  }
}

Paginator.styles = styles;
Paginator.errors = errors;

export default Paginator;
