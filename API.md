# API

## Table of Contents

* [Core](#core)
  - [Paginator](#paginator)
    * [paginator.page](#paginatorpage)
    * [paginator.queryHandler](#paginatorqueryhandler)
    * [paginator.current](#paginatorcurrent)
    * [paginator.next](#paginatornext)
    * [paginator.prev](#paginatorprev)
    * [paginator.first](#paginatorfirst)
    * [paginator.last](#paginatorlast)
    * [paginator.fetchPage](#paginatorfetchpage)
    * [paginator.fetchPageCount](#paginatorfetchpagecount)
    * [paginator.setQueryHandler](#paginatorsetqueryhandler)
    * [paginator.setQueryParams](#paginatorsetqueryparams)
  - [Query Handler](#query-handler)
    * [queryHandler.makeParams](#queryhandlermakeparams)
    * [queryHandler.resolvePage](#queryhandlerresolvepage)
    * [queryHandler.setParams](#queryhandlersetparams)
  - [PageMerger](#pagemerger)
    * [new PageMerger](#new-pagemerger)
    * [pageMerger.merge](#pagemergermerge)
  - [PaginatorError](#paginatorerror)
    * [new PaginatorError](#new-paginatorerror)
* [Paginators](#paginators)
  - [BasePaginator](#basepaginator)
    * [new BasePaginator](#new-basepaginator)
  - [PageNumberPaginator](#pagenumberpaginator)
    * [new PageNumberPaginator](#new-pagenumberpaginator)
  - [LimitOffsetPaginator](#limitoffsetpaginator)
    * [new LimitOffsetPaginator](#new-limitoffsetpaginator)
* [Query Handlers](#query-handlers)
  - [PageNumberQueryHandler](#pagenumberqueryhandler)
    * [new PageNumberQueryHandler](#new-pagenumberqueryhandler)
    * [queryHandler.setOptions](#queryhandlersetoptions)
  - [LimitOffsetQueryHandler](#limitoffsetqueryhandler)
    * [new LimitOffsetQueryHandler](#new-limitoffsetqueryhandler)
    * [queryHandler.setOptions](#queryhandlersetoptions-1)
* [Utility](#utility)
  - [paginate](#paginate)
  - [all](#all)
* [Requests](#requests)
* [Comprehensive Example](#comprehensive-example)

## Core

### Paginator

#### paginator.page

This is a [getter][mdn-defineproperty] property.

[mdn-defineproperty]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

```javascript
let paginator = new BasePaginator(request);
// True
paginator.page === 0;
```

#### paginator.queryHandler

See the [Query Handler](#query-handler) section for available methods.

```javascript
let queryParams = { format: 'json' };
paginator.queryHandler.setParams(queryParams);
```

#### paginator.current

```javascript
let promise = paginator.current();
```

#### paginator.next

```javascript
let promise = paginator.next();
```

#### paginator.prev

```javascript
let promise = paginator.prev();
```

#### paginator.first

```javascript
let promise = paginator.first();
```

#### paginator.last

_This method doesn't update [`paginator.page`](#paginatorpage) synchronously._
Operations that rely on `paginator.page` shouldn't be invoked while this method is active.

```javascript
let promise = paginator.last();
```

#### paginator.fetchPage

```javascript
let page = 42;
let promise = paginator.fetchPage(page);
```

#### paginator.fetchPageCount

```javascript
let promise = paginator.fetchPageCount();

promise.then((pageCount) => {});
```

#### paginator.setQueryHandler

Set the paginator's query handler.

```javascript
let queryHandler = new PageNumberQueryHandler();

paginator.setQueryHandler(queryHandler);
```

#### paginator.setQueryParams

Sets the paginator's query parameters. The paginator's current page is set.

```javascript
let queryParams = { page: 5 };

paginator.setQueryParams(queryParams);
```

### Query Handler

#### queryHandler.makeParams

```javascript
let page = 42;
let queryParams = queryHandler.makeParams(page);
```

#### queryHandler.resolvePage

```javascript
let queryParams = { offset: 50 };
let page = queryHandler.resolvePage(queryParams);
```

#### queryHandler.setParams

This method overwrites parameters that were set previously.

```javascript
let queryParams = { format: 'json' };

queryHandler.setParams(queryParams);
```

### PageMerger

#### new PageMerger

```javascript
let paginator = new PageNumberPaginator(request);
let pageMerger = new PageMerger(paginator)
```

#### pageMerger.merge

```javascript
let startPage = 20;
let endPage = 100;

let promise = pageMerger.merge(startPage, endPage);

promise.then((mergedResponse) => {
  let {count, results} = mergedResponse;
})
```

### PaginatorError

#### new PaginatorError

```javascript
let error = new PaginatorError('Something went wrong.');

// True
error instanceof PaginatorError;
// True
error instanceof Error;
```

## Paginators

### BasePaginator

#### new BasePaginator

```javascript
new BasePaginator(request[, requestOptions]);
```

```javascript
let paginator = new BasePaginator(request);
```

A `BasePaginator` instance doesn't have a query handler by default.
See [`paginator.setQueryHandler`](#paginatorsetqueryhandler) for information.

### PageNumberPaginator

#### new PageNumberPaginator

```javascript
new PageNumberPaginator(request[, requestOptions, queryParams]);
```

```javascript
let queryParams = { page: 2 };
let paginator = new PageNumberPaginator(request, null, queryParams);
// True
paginator.page === 2;
```

### LimitOffsetPaginator

#### new LimitOffsetPaginator

```javascript
new LimitOffsetPaginator(request[, requestOptions, queryParams]);
```

```javascript
let queryParams = { limit: 50, offset: 50 };
let paginator = new LimitOffsetPaginator(request, null, queryParams);
// True
paginator.page === 2;
```

## Query Handlers

### PageNumberQueryHandler

#### new PageNumberQueryHandler

```javascript
new PageNumberQueryHandler([options]);
```

See [queryHandler.setOptions](#paginatorsetoptions).

#### queryHandler.setOptions

```javascript
queryHandler.setOptions(options);
```

_Options:_

* `pageQueryParam`
  - Matches the endpoint's [`page_query_param`][drf-page-number-config] option
  - Defaults to `'page'`

_Example:_

```javascript
let options = { pageQueryParam: 'p' };
let queryHandler = new PageNumberQueryHandler(options);
let queryParams = queryHandler.makeParams(42);
// True
queryParams.p === 42;
```

[drf-page-number-config]: http://www.django-rest-framework.org/api-guide/pagination/#configuration

### LimitOffsetQueryHandler

#### new LimitOffsetQueryHandler

```javascript
new LimitOffsetQueryHandler([options]);
```

See [queryHandler.setOptions](#paginatorsetoptions_1).

#### queryHandler.setOptions

```javascript
queryHandler.setOptions(options);
```

_Options:_

* `limitQueryParam`
  - Matches the endpoint's [`limit_query_param`][drf-limit-offset-config] option
  - Defaults to `'limit'`
* `offsetQueryParam`
  - Matches the endpoint's [`offset_query_param`][drf-limit-offset-config] option
  - Defaults to `'offset'`

[drf-limit-offset-config`]: http://www.django-rest-framework.org/api-guide/pagination/#configuration_1

_Example:_

```javascript
let options = {
  limitQueryParam: 'l',
  offsetQueryParam: 'o'
};
let queryHandler = new LimitOffsetQueryHandler(options);

queryHandler.setParams({ l: 50 });

let queryParams = queryHandler.makeParams(3);
// True
queryParams.l === 50;
// True
queryParams.o === 100;
```

## Utility

#### paginate

```javascript
paginate(request[, requestOptions, queryParams]);
```

Returns a `PageNumberPaginator`.

```javascript
let paginator = drfp.paginate(request);
```

#### all

```javascript
all(request|paginator[, requestOptions, queryParams]);
```

Fetches all of the results for a given request

See [pageMerger.merge](#pagemergermergestartpage-endpage) for return details.

```javascript
drfp.all(request)
  .then(resolve, reject);
```

## Requests

#### Arguments

For each request sent, the paginator passes two arguments to the `request` function.

* `options` is a copy of the `requestOptions` object that is provided during initialization.
* `queryParams` contains the query string parameters for the current request.

#### Example:

```javascript
import querystring from 'querystring';


let request = function(options, queryParams) {
  let {user} = options;
  let query = querystring.stringify(queryParams);
  let url = `https://example.com/users/${user/}?${query}`;

  return fetch(url)
    .then((response) => response.json());
};
let requestOptions = { user: 'abc123' };
let paginator = new PageNumberPaginator(request, requestOptions);
```

## Comprehensive Example

_Scenario:_

* Our app has a gallery and displays 200 images per page.
* Image links are retrieved from a service endpoint.
* The endpoint uses limit-offset pagnation and has a max limit of 20.

_Solution:_

```javascript
import drfp from 'drf-paginator';
import {requests} from 'user-image-service';

/**
 * Create a paginator for the endpoint using an existing request function
 */
const userPhotoUrls = new drfp.LimitOffsetPaginator(
  requests.fetchPhotoUrls,
  { user: 'abc123' },
  { limit: 20 }
);

/**
 * Create a request function that retrieves and merges ten pages of results
 */
const batchFetchPhotoUrls = function(options, queryParams) {
  const {page} = queryParams;
  const startPage = page * 10 - 9;
  const endPage = page * 10;
  const pageMerger = new drfp.PageMerger(userPhotoUrls);

  return pageMerger.merge(startPage, endPage);
};

/**
 * Create a paginator for the new request function
 */
let batchUserPhotoUrls = drfp.paginate(batchFetchPhotoUrls);

const displayNextImages = function() {
  return batchUserPhotoUrls.next()
    .then(displayPhotos)
    .catch(displayError);
};

/**
 * Display the first page of 200 images
 */
showNextImages();
```
