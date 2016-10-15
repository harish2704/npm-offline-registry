var path = require('path');
var fs = require('fs');
var config = require( __dirname + '/./config' );
var Promise = require('bluebird');
var _exec = Promise.promisify( require('child_process').exec );

var REGISTRY_NAME = config.REGISTRY_NAME;
var LOCAL_REGISTRY = config.LOCAL_REGISTRY;
var NPM_PATH = config.NPM_PATH;


function exec( cmd, envVars ){
  return _exec( cmd, { env: envVars });
}
exports.exec = exec;

function fileExists( fname ){
  return new Promise( function( resolve ){
    fs.exists( fname, function(exists){
      resolve( exists );
    });
  });
}
exports.fileExists = fileExists;

var readFile = Promise.promisify( fs.readFile );
exports.readFile = readFile;


exports.patchData = function ( data ){
  /* Get the list of versions which is available in local cache */
  var cachedVersions = fs.readdirSync( path.join( NPM_PATH, data.name ) );
  Object.keys(data.versions).forEach( function( v ){
    var val = data.versions[v];

    /* Suppose our cache.json is at latest revision. It contains lot of versions which is not available in local cache.
    Then, Remove the versions which is not in local cache from the list. Otherwise npm will always choose higher versions whcih is not available in our cache */
    /* TODO: If this feature causing problem, We can make this behaviour optional via some commandline-arguments/Env-variables */
    if( cachedVersions.indexOf(v) == -1 ){
      delete data.versions[v];
      return;
    }
    var protocal = 'http://';
    if( val.dist.tarball.indexOf( 'https:' ) !== false ){
      protocal = 'https://';
    }
    val.dist.tarball = val.dist.tarball.replace( protocal + REGISTRY_NAME, LOCAL_REGISTRY );
  });
};

var fetchAndCacheMetadataCmd =[
  'mkdir -p $packageCacheDir',
  'wget -nv "http://$REGISTRY_NAME/$packageName" -O $cacheFile || { wgetExitStatus=$? && rm $cacheFile; exit $wgetExitStatus ; }'
].join( ';' );

var  fetchAndCacheTarballCmd = [
  'mkdir -p $packageTarballDir',
  'wget -nv $tarballUrl -O $tarballPath || { wgetExitStatus=$? && rm $tarballPath; exit $wgetExitStatus ; }',
  'cd $packageTarballDir; tar -xzf package.tgz package/package.json',
].join( ';' );


function encodePackageName( packageName ){
  //handle slash in scoped package name but do not convert @
  return encodeURIComponent(packageName).replace(/^%40/, '@');
}

exports.fetchAndCacheMetadata = function ( packageName, cacheFile ){
  var packageCacheDir = path.dirname( cacheFile );
  packageName = encodePackageName( packageName );
  return exec( fetchAndCacheMetadataCmd, {
    packageCacheDir: packageCacheDir,
    REGISTRY_NAME: REGISTRY_NAME,
    packageName: packageName,
    cacheFile: cacheFile,
  });
};

exports.fetchAndCacheTarball = function ( packageName, version, tarballPath ){
  packageName = encodePackageName( packageName );
  
  var tarballUrl = 'http://' + REGISTRY_NAME + '/' + packageName + '/-/' + packageName + '-' + version + '.tgz';
  var packageTarballDir = path.dirname( tarballPath );

  return exec( fetchAndCacheTarballCmd, {
    packageTarballDir: packageTarballDir,
    tarballUrl: tarballUrl,
    tarballPath: tarballPath,
  });
};




