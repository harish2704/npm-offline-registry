# npm-offline-registry
Supper simple NPM registry server for offline NPM install

# Usage

* install this npm mpdule

  `npm i harish2704/npm-offline-registry`
* Run local npm-registry server

  `npm-offline-registry`
  *OR*
   `node node_modules/.bin/npm-offline-registry`

* Now the server will run on [http://localhost:8080](http://localhost:8080)
* use `http://localhost:8080/` as registry while doing npm install
  - Either use `npm install --registry http://localhost:8080/ [package-name]...`
  - Or permanently set config variable `npm config set registry http://localhost:8080/`


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
