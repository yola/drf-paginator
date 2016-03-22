class PageMerger {
  constructor(paginator) {
    this._count = null;
    this._paginator = paginator;
  }

  merge(startPage, endPage) {
    return this._fetchRequests(startPage, endPage)
      .then(this._makeCollection.bind(this))
      .then(this._mergeCollection.bind(this))
      .then(this._makeResponse.bind(this));
  }

  _fetchRequests(startPage, endPage) {
    const paginator = this._paginator;
    const requests = [];

    for (let page = startPage; page <= endPage; page++) {
      requests.push(paginator.fetchPage(page));
    }

    return Promise.all(requests);
  }

  _makeCollection(responses) {
    const collection = [];

    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];

      collection.push(response.json());
    }

    return Promise.all(collection);
  }

  _mergeCollection(collection) {
    let count = null;
    let results = [];

    for (let i = 0; i < collection.length; i++) {
      const responseBody = collection[i];

      if (count < responseBody.count) {
        count = responseBody.count;
      }

      results = results.concat(responseBody.results);
    }

    return {
      count,
      results
    };
  }

  _makeResponse(responseBody) {
    return new Response(JSON.stringify(responseBody));
  }
}

export default PageMerger;
