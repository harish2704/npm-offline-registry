var express = require('express');
var fs = require('fs');

var NPM_PATH = process.env.HOME + '/.npm';
var REGISTRY_NAME = 'registry.npmjs.org';
var LOCAL_REGISTRY = 'localhost:8080';


var app = express();

function patchData( data ){
  Object.keys(data.versions).forEach( function( v ){
    var val = data.versions[v];
    val.dist.tarball = val.dist.tarball.replace( REGISTRY_NAME, LOCAL_REGISTRY );
  });
}


app.use( function(req, res, next ){
  console.log(req.method, req.path );
  next();
});

app.get( '/:package', function( req, res ){
  var packageName = req.params.package;
  var cacheFile = [ NPM_PATH, REGISTRY_NAME, packageName, '.cache.json' ].join( '/' );
  var cacheData = fs.readFileSync( cacheFile, 'utf-8' );
  cacheData = JSON.parse( cacheData );

  patchData( cacheData );
  return res.send( cacheData );
});

app.get( '/:package/-/:packageName-:version.tgz', function( req, res ){
  var packageName = req.params.package;
  var version = req.params.version.split('-').pop();
  var packagePath = [ NPM_PATH , packageName, version, 'package.tgz'].join( '/' );
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
