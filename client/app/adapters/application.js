import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  namespace: 'api',

  coalesceFindRequests: true,

  // handle validation errors
  ajaxError: function(jqXHR) {
    var error = this._super(jqXHR);

    if (jqXHR && jqXHR.status === 400) {
      var jsonErrors = Ember.$.parseJSON(jqXHR.responseText);

      return new DS.InvalidError(jsonErrors);
    } else {
      return error;
    }
  },

  pathForType: function(type) {
    // porpoiseflow/taskNode -> porpoiseflow/task-node
    var dasherized = Ember.String.dasherize(type);

    // porpoiseflow/task-node -> task-node
    var pathComponents = dasherized.split('/');
    var flattened = pathComponents[pathComponents.length - 1];

    // task-node -> task-nodes
    return Ember.String.pluralize(flattened);
  }
});
