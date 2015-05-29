import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('process-defs');

  this.route('process/new', {path: 'processes/new'});
  this.route('process', {path: 'processes/:id'});
  this.route('node', {path: 'nodes/:id'});
  this.route('logging/new', {path: 'loggings/new'});
  this.route('logging', {path: 'loggings/:id'});
});

export default Router;
