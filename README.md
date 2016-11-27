Supper simple NPM registry server for offline NPM install

# Usage

* install this npm mpdule

  `npm i harish2704/npm-offline-registry`
* Run local npm-registry server

  `npm-offline-registry`
  *OR*
   `node node_modules/.bin/npm-offline-registry`

* Now the server will run on [http://localhost:8234](http://localhost:8234)
* use `http://localhost:8234/` as registry while doing npm install
  - use command `npm-offline-install` instead of `npm install` if you need to install packages offline. This is just a wrapper cli which will run `npm i` with `--registry` option set
  - Advanced usage
    * Either use `npm install --registry http://localhost:8234/ [package-name]...`
    * Or permanently set config variable `npm config set registry http://localhost:8234/`

**NOTE:** *default port can be changed by setting `PORT` environment variable *


# How it is working?

* When ever we do `npm install` in normal condition, the `npm` tool will keep a cache directory of the files which was downloaded by `npm` tool.
* Default location of this cache directory is `~/.npm` for UNIX machines
* `npm-offline-registry` tool will serve the requests using the cached versions of the files.
* If a package/version is not found on cache, it is fetched from main `npm` registry. Then is properly inserted in to npm's cache directory.

# Dependencies

Currently this tool is using following unix commands to manipulate npm's cache directory.

* `wget` for downloading the content from main npm registry
* `mkdir` with `-p` option
* `tar` command with gzip uncompresion

I believe all the above said tools will be available in a typical UNIX machine.

# Configurations

Please check config.js. All config values can be over-written by `environment-variables` 

# Suggestion for desktop users

* make sure that, Some process manager tool ( Lets say [pm2](https://github.com/Unitech/pm2) is available in your `PATH` )
* install npm-offline-registry globally ( Or add your $HOME/node_modules/.bin to PATH variable )
* Add this start-up command to your "start up applications" `pm2 start npm-offline-registry`
* Then you can use the command `npm-offine-install` at any time duting the desktop-session without any hassle


# Using npm-offline-registry as a completely isolated registry

If you set the ``ENABLE_NPM_FAILOVER`` config value to ``false`` then npm-offlin-registry will not attempt to
contact the upstream NPM registry for unknown packages and instead return a 404 response, meaning you can use
it as an alternative to the NPM registry behind a firewall / isolated from the internet.

# Enabling strict mode

If config value `STRICT` is set to true, while npm checks for the available versions of a given packages, 
registry server will reply with list of cached versions.
In this case, if the version is not previously cached, npm-offline-install will fail with, error message `version not available`

example
```bash 
env STRICT=true npm-offline-registry`
```
