/* globals describe, it */

var utils = require( '../utils' );
var assert = require('assert');
var fs = require('fs');
var path = require('path');


var fetchAndCacheMetadata = utils.fetchAndCacheMetadata;
var fetchAndCacheTarball = utils.fetchAndCacheTarball;

/* TODO: write test */
// var patchData = utils.patchData;


describe( 'Utility functions ', function(){

  it.skip( 'should fetchAndCacheMetadata', function( ){
    var cacheFile = '/home/hari/.npm/registry.npmjs.org/lodash/.cache.json';
    fetchAndCacheMetadata( 'lodash', cacheFile );
    assert( fs.existsSync( cacheFile ) );
  });

  it( 'should fetchAndCacheTarball', function(){
    var cacheFile = '/home/hari/.npm/lodash/4.2.1/package.tgz';
    var packageJsonFile =  path.dirname( cacheFile ) + '/package/package.json';

    fetchAndCacheTarball( 'lodash', '4.2.1', cacheFile );
    assert( fs.existsSync( cacheFile ) );
    assert( fs.existsSync( packageJsonFile ) );
  });
});
