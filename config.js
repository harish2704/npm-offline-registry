
var defaultConfig = {
  NPM_PATH       : process.env.HOME + '/.npm',
  REGISTRY_NAME  : 'registry.npmjs.org',
  LOCAL_REGISTRY : 'localhost:8080',
};

var config = {};

Object.keys( defaultConfig ).forEach( function(v){
  config[v] = process.env[v] || defaultConfig[v];
});

module.exports = config;

