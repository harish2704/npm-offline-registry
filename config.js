
var defaultConfig = {
  NPM_PATH       : process.env.HOME + '/.npm',
  REGISTRY_NAME  : 'registry.npmjs.org',
  PORT: 8234
};

var config = {};

Object.keys( defaultConfig ).forEach( function(v){
  config[v] = process.env[v] || defaultConfig[v];
});

config.LOCAL_REGISTRY = 'localhost:' + config.PORT;

module.exports = config;

