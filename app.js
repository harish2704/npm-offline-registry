var express = require('express');
var fs = require('fs');
var config = require( __dirname + '/./config' );
var utils = require( __dirname + '/./utils');

var NPM_PATH = config.NPM_PATH;
var REGISTRY_NAME = config.REGISTRY_NAME;

var fetchAndCacheMetadata = utils.fetchAndCacheMetadata;
var fetchAndCacheTarball = utils.fetchAndCacheTarball;
var patchData = utils.patchData;

var app = express();
app.use( function(req, res, next ){
  console.log(req.method, req.path );
  next();
});

app.get( '/:package', function( req, res ){
  var packageName = req.params.package;
  var cacheFile = [ NPM_PATH, REGISTRY_NAME, packageName, '.cache.json' ].join( '/' );
  var cacheData;

  if( !fs.existsSync( cacheFile ) ){
    fetchAndCacheMetadata( packageName, cacheFile );
  }

  cacheData = fs.readFileSync( cacheFile, 'utf-8' );
  cacheData = JSON.parse( cacheData );

  patchData( cacheData );
  return res.send( cacheData );
});

app.get( '/:package/-/:packageName-:version.tgz', function( req, res ){
  var packageName = req.params.package;
  var version = req.params.version.split('-').pop();
  var packagePath = [ NPM_PATH , packageName, version, 'package.tgz'].join( '/' );

  if( !fs.existsSync( packagePath ) ){
    fetchAndCacheTarball( packageName, version, packagePath );
  }

  return fs.createReadStream( packagePath ).pipe( res );
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}



module.exports = app;
