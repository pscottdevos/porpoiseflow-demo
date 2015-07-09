/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  if (EmberApp.env() !== 'production') {
    //this is ONLY needed because PhantomJS doesn't support bind()
    //if Phantom adds bind(), we can take this out
    app.import(
      app.bowerDirectory + '/bind-polyfill/index.js',
      { type: 'test' });
  }

  app.import(
    app.bowerDirectory + '/bootstrap-sass/assets/javascripts/bootstrap.js');

  return app.toTree();
};
