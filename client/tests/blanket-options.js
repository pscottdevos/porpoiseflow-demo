/* globals blanket, module */

var options = {
  modulePrefix: 'client',
  filter: '//.*client/.*/',
  antifilter: '//.*(tests|template).*/',
  loaderExclusions: [
    'client/components/liquid',
    'client/components/lf-outlet',
    'client/components/lf-overlay',
    'client/components/liquid-bind',
    'client/components/liquid-child',
    'client/components/liquid-container',
    'client/components/liquid-measured',
    'client/components/liquid-if',
    'client/components/liquid-modal',
    'client/components/liquid-outlet',
    'client/components/liquid-spacer',
    'client/components/liquid-unless',
    'client/components/liquid-versions',
    'client/components/liquid-with',
    'client/components/lm-container',
    'client/config/environment',
    'client/initializers/liquid-fire',
    'client/initializers/app-version',
    'client/initializers/export-application-global',
    'client/transitions',
    'client/services/liquid-fire-modals',
    'client/services/liquid-fire-transitions'
  ],
  enableCoverage: true,
  cliOptions: {
    reporters: ['json'],
    autostart: true
  }
};
if (typeof exports === 'undefined') {
  blanket.options(options);
} else {
  module.exports = options;
}
