var execSync = require('child_process').execSync;
var path = require('path');
var config = require( __dirname + '/./config' );

var REGISTRY_NAME = config.REGISTRY_NAME;
var LOCAL_REGISTRY = config.LOCAL_REGISTRY;

exports.patchData = function ( data ){
  Object.keys(data.versions).forEach( function( v ){
    var val = data.versions[v];
    val.dist.tarball = val.dist.tarball.replace( REGISTRY_NAME, LOCAL_REGISTRY );
  });
};

exports.fetchAndCacheMetadata = function ( packageName, cacheFile ){
  var packageCacheDir = path.dirname( cacheFile );
  execSync( 'mkdir ' + packageCacheDir );
  execSync( 'wget http://' + REGISTRY_NAME + '/' + packageName + ' -O ' + cacheFile );
};

exports.fetchAndCacheTarball = function ( packageName, version, tarballPath ){
  var tarballUrl = 'http://' + REGISTRY_NAME + '/' + packageName + '/-/' + packageName + '-' + version + '.tgz';
  var packageTarballDir = path.dirname( tarballPath );
  execSync( 'mkdir -p ' + packageTarballDir );
  execSync( 'wget ' + tarballUrl + ' -O ' + tarballPath );
  execSync( 'cd ' + packageTarballDir + ';tar -xzf package.tgz package/package.json' );
};



