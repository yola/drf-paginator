import assign from 'lodash.assign';
import omit from 'lodash.omit';

import * as actions from 'src/actions';
import PaginatorError from 'src/paginator-error';


export const errors = Object.freeze({
  calculateOffsetNoLimit: 'Can\'t calculate offsets without a limit',
  calculatePageNoLimit: 'Can\'t calculate pages without a limit'
});

const defaultOptions = {
  limitQueryParam: 'limit',
  offsetQueryParam: 'offset'
};

export class LimitOffsetQueryHandler {
  constructor(options) {
    this._excessParams = null;
    this._limit = null;
    this.setOptions(options);
  }

  makeParams(page) {
    const opts = this._options;
    const queryParams = assign({}, this._excessParams);

    queryParams[opts.limitQueryParam] = this._limit;
    queryParams[opts.offsetQueryParam] = this._calculateOffset(page);

    return queryParams;
  }

  resolvePage(queryParams) {
    const {offset, limit} = this._parse(queryParams);

    if (offset === 0) {
      return 1;
    }

    if (!limit) {
      throw new PaginatorError(errors.calculatePageNoLimit);
    }

    return (offset + limit) / limit;
  }

  setParams(queryParams) {
    const result = this._parse(queryParams);
    this._excessParams = result.excess;
    this._limit = result.limit;

    return this;
  }

  onResponse(response, page) {
    if (page === 1 && !this._limit) {
      this._limit = actions.inferLimit(response);
    }
  }

  setOptions(options) {
    this._options = assign({}, defaultOptions, options);

    return this;
  }

  _parse(queryParams) {
    const {limitQueryParam, offsetQueryParam} = this._options;
    const defaults = {
      limit: null,
      offset: 0
    };
    const result = assign({}, defaults);

    if (queryParams.hasOwnProperty(limitQueryParam)) {
      result.limit = queryParams[limitQueryParam];
    }
    if (queryParams.hasOwnProperty(offsetQueryParam)) {
      result.offset = queryParams[offsetQueryParam];
    }

    result.excess = this._getExcess(queryParams);

    return result;
  }

  _getExcess(queryParams) {
    const opts = this._options;
    const paginationProperties = [
      opts.limitQueryParam,
      opts.offsetQueryParam
    ];

    return omit(queryParams, paginationProperties);
  }

  _calculateOffset(page) {
    const limit = this._limit;

    if (page === 1) {
      return 0;
    }
    if (!limit) {
      throw new PaginatorError(errors.calculateOffsetNoLimit);
    }

    return limit * page - limit;
  }
}

export default LimitOffsetQueryHandler;
