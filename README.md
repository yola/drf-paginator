# [drf-paginator](https://github.com/yola/drf-paginator)

JavaScript module for consuming paginated Django REST framework endpoints.

[![npm Version](https://img.shields.io/npm/v/drf-paginator.svg?style=flat-square)](https://www.npmjs.com/package/drf-paginator)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/yola/drf-paginator/master/LICENSE)
[![Build Status](https://img.shields.io/travis/yola/drf-paginator.svg?style=flat-square)](https://travis-ci.org/yola/drf-paginator)
[![Dependencies Status](https://img.shields.io/david/yola/drf-paginator.svg?style=flat-square)](https://www.npmjs.com/package/drf-paginator)
[![devDependencies Status](https://img.shields.io/david/dev/yola/drf-paginator.svg?style=flat-square)](https://www.npmjs.com/package/drf-paginator)

## Examples

### Creating a paginator and fetching the first page:

```javascript
import drfp from 'drf-paginator';


const paginator = drfp.paginate(request);

paginator.first()
  .then(function(response) {
     // Do something with the response
  });
```

### Creating a paginator using limit-offset pagination style:

```javascript
import {Paginator} from 'drf-paginator';


const limit = 50;
const style = Paginator.styles.limitOffset;
const paginator = new Paginator(request, null, {limit}, {style});
```

### Fetching all of the results for a given request:

```javascript
import drfp from 'drf-paginator';


drfp.all(request)
  .then(function(response) {
     // Do something with the response
  });
```

### Using two paginators to iterate over ten pages at a time:

```javascript
import {PageMerger, Paginator} from 'drf-paginator';


const paginator = new Paginator(request);
const pageMerger = new PageMerger(paginator);

const tenPageRequest = function(options, queryParams) {
  const {page} = queryParams;
  const startPage = (page * 10) - 9;
  const endPage = ((page + 1) * 10) - 10;

  return pageMerger.merge(startPage, endPage);
};

const tenPagePaginator = Paginator(tenPageRequest);
```

## Options

* `limitQueryParam`
  - Matches the endpoint's [`limit_query_param`](http://www.django-rest-framework.org/api-guide/pagination/#configuration_1) option
  - Defaults to `'limit'`
* `offsetQueryParam`
  - Matches the endpoint's [`offset_query_param`](http://www.django-rest-framework.org/api-guide/pagination/#configuration_1) option
  - Defaults to `'offset'`
* `pageQueryParam`
  - Matches the endpoint's [`page_query_param`](http://www.django-rest-framework.org/api-guide/pagination/#configuration) option
  - Defaults to `'page'`
* `style`
  - Indicates which pagination style to use.
  - Currently supports:
    - [`PageNumberPagination`](http://www.django-rest-framework.org/api-guide/pagination/#pagenumberpagination)
    - [`LimitOffsetPagination`](http://www.django-rest-framework.org/api-guide/pagination/#limitoffsetpagination)
  - Pagination styles are available via the `Paginator.styles` object.
  - Defaults to `Paginator.styles.pageNumber`

## Request functions

`drf-paginator` was designed to be used with the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
The paginator expects the provided request function to return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) compatible object, which contains a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) compatible object.

### Arguments

For each request sent, the paginator passes two arguments to the `request` function.

* `options` is a copy of the `requestOptions` object that is provided to the paginator during initialization.
  - The contents of the object is the same for every request invocation.
* `queryParams` contains the query string parameters for the current request.
  - The contents of the object is different for every request invocation.
  - This argument can be passed directly to a serializer such as [`querystring.stringify`](https://nodejs.org/dist/latest-v4.x/docs/api/querystring.html#querystring_querystring_stringify_obj_sep_eq_options).

### Example:

```javascript
import querystring from 'querystring';


const request = function(options, queryParams) {
  let url = 'https://example.com/endpoint?';
  url += querystring.stringify(queryParams);

  return fetch(url);
};
```

## Installation

Node.js via [npm](https://www.npmjs.com/package/drf-paginator)

```bash
$ npm install drf-paginator
```

SystemJS via [jspm](http://jspm.io/)

```bash
$ jspm install npm:drf-paginator
```

## Scripts

### Install Dependencies

```bash
$ npm install
```

### Run Test Suite:

```bash
$ npm test
```

### Run Linter

```bash
$ ./node_modules/.bin/jshint .
```

## License

Copyright &copy; 2016 [Yola](http://yola.com).
<br>Released under the [MIT License](https://github.com/yola/drf-paginator/master/LICENSE).