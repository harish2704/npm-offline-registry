/* globals describe, it, before */

var utils = require( '../utils' );
var assert = require('assert');
var fs = require('fs');
var path = require('path');


var fetchAndCacheMetadata = utils.fetchAndCacheMetadata;
var fetchAndCacheTarball = utils.fetchAndCacheTarball;
var exec = utils.exec;

/* TODO: write test */
// var patchData = utils.patchData;

var homeDir = process.env.HOME;
var testCacheFile = homeDir + '/.npm/registry.npmjs.org/lodash/.cache.json';
var testPackageFile = homeDir + '/.npm/lodash/4.2.1/package.tgz';



describe( 'Utility function s', function(){


  before( function(done){
    var cmd = [
      'if [[ -f $testCacheFile ]]; then rm $testCacheFile; fi',
      'if [[ -f $testPackageFile ]]; then rm $testPackageFile; fi'
    ].join( ';' );

    return exec( cmd , {
      testCacheFile: testCacheFile,
      testPackageFile: testPackageFile
    })
    .then( done );
  });


  it( 'should fetchAndCacheMetadata', function( done ){

    fetchAndCacheMetadata( 'lodash', testCacheFile )
      .then( function(){
        assert( fs.existsSync( testCacheFile ) );
        done();
      })
      .catch( done );
  });


  it( 'should fetchAndCacheTarball', function( done ){
    var packageJsonFile =  path.dirname( testPackageFile ) + '/package/package.json';

    fetchAndCacheTarball( 'lodash', '4.2.1', testPackageFile )
      .then( function(){
        assert( fs.existsSync( testPackageFile ) );
        assert( fs.existsSync( packageJsonFile ) );
        done();
      })
      .catch( done );
  });


  it( 'should fail if downloading fails', function( done ){
    fetchAndCacheMetadata( '456613231')
      .then( function(){
        return done( new Error('This should not resolve' ) );
      })
      .catch( function(e){
        assert.ok( e );
        assert.ok ( !fs.existsSync( homeDir + '/.npm/registry.npmjs.org/456613231/.cache.json' ) );
        done();
      });
  });


});
