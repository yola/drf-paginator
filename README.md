# [drf-paginator](https://github.com/yola/drf-paginator)

JavaScript module for consuming paginated [Django REST framework][drf] endpoints.

[drf]: http://www.django-rest-framework.org

[![npm Version][badge-npm]][package]
[![MIT License][badge-license]][license]
[![Build Status][badge-travis]][travis]
[![Coverage][badge-coveralls]][coveralls]
[![Dependencies Status][badge-david]][david]
[![devDependencies Status][badge-david-dev]][david]

[badge-coveralls]: https://img.shields.io/coveralls/yola/drf-paginator.svg?style=flat-square
[badge-david]: https://img.shields.io/david/yola/drf-paginator.svg?style=flat-square
[badge-david-dev]: https://img.shields.io/david/dev/yola/drf-paginator.svg?style=flat-square
[badge-license]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[badge-npm]: https://img.shields.io/npm/v/drf-paginator.svg?style=flat-square
[badge-travis]: https://img.shields.io/travis/yola/drf-paginator.svg?style=flat-square
[coveralls]: https://coveralls.io/github/yola/drf-paginator
[david]: https://david-dm.org/yola/drf-paginator
[license]: https://github.com/yola/drf-paginator/blob/master/LICENSE
[package]: https://www.npmjs.com/package/drf-paginator
[travis]: https://travis-ci.org/yola/drf-paginator

## Usage

The paginator separates pagination logic from each individual request to the endpoint.

```javascript
import drfp from 'drf-paginator';
```

Each request to the endpoint is handled by a request function.
Request functions are provided with options and query parameters to make requests.
They in turn return [promises][promise-spec] for the response body.

```javascript
let request = function(options, queryParams) {
  return Promise<ResponseBody>;
}
```

Each paginator is provided with a request function to send requests.

```javascript
let paginator = drfp.paginate(request);
```

Paginator's provide an interface for pagination while caching requests.

```javascript
paginator.next()
  .then((responseBody) => {
     // Do something with the response
  });
```

Please view the [API reference][api] for details and more examples.

[api]: https://github.com/yola/drf-paginator/blob/master/API.md
[promise-spec]: https://promisesaplus.com/

## Requirements

A [Promises/A+][promise-spec] compliant promise implementation must be available globally.

Consumers using [Browserify](browserify) must have the [Babelify](babelify) transform.

[babelify]: https://github.com/babel/babelify
[browserify]: http://browserify.org/

## Installation

Node.js via [npm](https://www.npmjs.com)

```bash
$ npm install --save drf-paginator
```

SystemJS via [jspm](http://jspm.io)

```bash
$ jspm install npm:drf-paginator
```

## Scripts

Install dependencies

```bash
$ npm install
```

Run the test suite, generate coverage reports, and lint the source

```bash
$ npm test
```

Run linter

```bash
$ npm run jshint
```

Run unit tests

```bash
$ npm run unit
```

Run the test suite, and generate coverage reports

```bash
$ npm run cover
```

Publish coverage report

```bash
$ npm run coveralls
```

## License

Copyright &copy; 2016 [Yola](http://yola.com).
<br>Released under the [MIT Expat License][license].
