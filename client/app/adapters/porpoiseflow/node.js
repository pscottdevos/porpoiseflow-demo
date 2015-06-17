import Ember from 'ember';
import DS from 'ember-data';
import ApplicationAdapter from '../application';

export default ApplicationAdapter.extend({
  assign: function (node, store, actor) {
    var self = this;
    var typeKey = node.get('namespace') + node.get('subclass').camelize();
    var data = {};
    data[typeKey] = {actor: actor.get('id')};
    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        url: self.namespace + '/' + node.get('subclass').dasherize().pluralize() + '/' + node.get('id'),
        type: "PATCH",
        data: JSON.stringify(data),
        headers: self.headers
      })
      .done((data, textStatus, jqXHR) => {
        resolve(store.push(typeKey, data[typeKey]));
      })
      .fail((jqXHR, textStatus, errorThrown) => reject(errorThrown));
    });
  }
});
