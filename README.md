# [drf-paginator](https://github.com/yola/drf-paginator)

JavaScript module for consuming paginated [Django REST framework][DRF] endpoints.

[DRF]: http://www.django-rest-framework.org

[![npm Version][badge-npm]][package]
[![MIT License][badge-license]][license]
[![Build Status][badge-travis]][travis]
[![Dependencies Status][badge-david]][david]
[![devDependencies Status][badge-david-dev]][david]

[badge-npm]:https://img.shields.io/npm/v/drf-paginator.svg?style=flat-square
[badge-license]:https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[badge-travis]:https://img.shields.io/travis/yola/drf-paginator.svg?style=flat-square
[badge-david]:https://img.shields.io/david/yola/drf-paginator.svg?style=flat-square
[badge-david-dev]:https://img.shields.io/david/dev/yola/drf-paginator.svg?style=flat-square
[david]: https://david-dm.org/yola/drf-paginator
[license]: https://github.com/yola/drf-paginator/blob/master/LICENSE
[package]: https://www.npmjs.com/package/drf-paginator
[travis]: https://travis-ci.org/yola/drf-paginator

```javascript
import drfp from 'drf-paginator';


let paginator = drfp.paginate(request);

paginator.next()
  .then((response) => {
     // Do something with the response
  });
```

## API

Please view the [API reference][api] for details and examples.

[api]: https://github.com/yola/drf-paginator/blob/master/API.md

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

Run tests and lint

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

## License

Copyright &copy; 2016 [Yola](http://yola.com).
<br>Released under the [MIT Expat License][license].
