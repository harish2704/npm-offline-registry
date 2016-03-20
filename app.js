var express = require('express');
var config = require( __dirname + '/./config' );
var utils = require( __dirname + '/./utils');

var NPM_PATH = config.NPM_PATH;
var REGISTRY_NAME = config.REGISTRY_NAME;


var fetchAndCacheMetadata = utils.fetchAndCacheMetadata;
var fetchAndCacheTarball = utils.fetchAndCacheTarball;
var patchData = utils.patchData;
var fileExists = utils.fileExists;
var readFile = utils.readFile;

var app = express();
app.use( function(req, res, next ){
  res._log = {
    method: req.method,
    path: req.path,
    cacheHit: 'Hit',
    cacheFile: '',
  };

  res.on( 'finish', function(){
    var log = this._log;
    console.log( log.cacheHit, this.statusCode, log.method, log.path, '    =>   ', log.cacheFile  );
  });
  // setTimeout( next, 1000 );
  next();
});

app.get( '/:package', function( req, res, next ){
  var packageName = req.params.package;
  var cacheFile = [ NPM_PATH, REGISTRY_NAME, packageName, '.cache.json' ].join( '/' );

  return fileExists( cacheFile )
    .tap( function( isExists ){
      if( !isExists ){
        res._log.cacheHit = '---';
        return fetchAndCacheMetadata( packageName, cacheFile );
      }
    })
    .then( function( ){
      res._log.cacheFile = cacheFile;
      return readFile( cacheFile, 'utf-8' );
    })
    .then( function( cacheData ){
      cacheData = JSON.parse( cacheData );
      patchData( cacheData );
      return res.send( cacheData );
    })
    .catch( next );
});

app.get( '/:package/-/:tarball', function( req, res, next ){
  var packageName = req.params.package;
  var version = req.params.tarball.match( new RegExp( packageName + '-(.*).tgz') )[1];
  var packagePath = [ NPM_PATH , packageName, version, 'package.tgz'].join( '/' );

  fileExists( packagePath )
    .tap( function( isExists ){
      if( !isExists ){
        res._log.cacheHit = '---';
        return fetchAndCacheTarball( packageName, version, packagePath );
      }
    })
    .then( function(){
      res._log.cacheFile = packagePath;
      return res.sendFile( packagePath );
    })
    .catch( next );
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

app.use(function(err, req, res, next) {
  console.log( err.stack );
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: err
  });
  if( next ) { next(); }
});



module.exports = app;
