import assign from 'lodash.assign';
import omit from 'lodash.omit';


const defaultOptions = {
  pageQueryParam: 'page'
};

export class PageNumberQueryHandler {
  constructor(options) {
    this._excessParams = null;
    this.setOptions(options);
  }

  makeParams(page) {
    const queryParams = assign({}, this._excessParams);

    queryParams[this._options.pageQueryParam] = page;

    return queryParams;
  }

  resolvePage(queryParams) {
    return this._parse(queryParams).page;
  }

  setParams(queryParams) {
    const result = this._parse(queryParams);
    this._excessParams = result.excess;

    return this;
  }

  setOptions(options) {
    this._options = assign({}, defaultOptions, options);

    return this;
  }

  _getExcess(queryParams) {
    return omit(queryParams, [this._options.pageQueryParam]);
  }

  _parse(queryParams) {
    const {pageQueryParam} = this._options;
    const defaults = { page: 0 };
    const result = assign({}, defaults);

    if (queryParams.hasOwnProperty(pageQueryParam)) {
      result.page = queryParams[pageQueryParam];
    }

    result.excess = this._getExcess(queryParams);

    return result;
  }
}

export default PageNumberQueryHandler;
