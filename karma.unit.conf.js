'use strict';

module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha'],
    browsers: ['PhantomJS'],
    browserify: {
      debug: true,
      watch: true,
      paths: [
        '.'
      ],
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'text' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' }
      ]
    },
    preprocessors: {
      'src/**/*.js': ['browserify'],
      'src/**/!(test-setup|*spec|*mock|*stub|*spy).js': ['coverage']
    },
    files: [
      'src/test-setup.js',
      'src/**/*.js'
    ],
    reporters: ['spec', 'coverage'],
    singleRun: true,
    browserNoActivityTimeout: 30000
  });
};
