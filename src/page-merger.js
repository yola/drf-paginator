import reduce from 'lodash.reduce';


class PageMerger {
  constructor(paginator) {
    this._count = null;
    this._paginator = paginator;
  }

  merge(startPage, endPage) {
    return this._fetchRequests(startPage, endPage)
      .then((res) => this._mergeResponses(res));
  }

  _fetchRequests(startPage, endPage) {
    const paginator = this._paginator;
    const requests = [];

    for (let page = startPage; page <= endPage; page++) {
      requests.push(paginator.fetchPage(page));
    }

    return Promise.all(requests);
  }

  _mergeResponses(responses) {
    const merge = function(result, response) {
      if (result.count < response.count) {
        result.count = response.count;
      }

      result.results = result.results.concat(response.results);

      return result;
    };

    const defaultResult = {
      count: null,
      results: []
    };

    return reduce(responses, merge, defaultResult);
  }
}

export default PageMerger;
