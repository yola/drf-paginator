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
    preprocessors: {
      'src/**/*.js': ['browserify']
    },
    files: [
      'src/test-setup.js',
      'src/**/*.js'
    ],
    reporters: ['spec'],
    singleRun: true,
    browserNoActivityTimeout: 30000
  });
};
