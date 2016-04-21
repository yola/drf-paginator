import appModulePath from 'app-module-path';
import bluebird from 'bluebird';


appModulePath.addPath(__dirname + '/..');
global.Promise = bluebird;
