import Ember from 'ember';
import DS from 'ember-data';
import ApplicationAdapter from '../application';

export default ApplicationAdapter.extend({
  assign: function (node, store, actor) {
    var self = this;
    var typeKey = node.constructor.typeKey;
    var data = {};
    data[typeKey] = {actor: actor.get('id')};
    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        url: self.namespace + '/' + node.get('subclass').dasherize().pluralize() + '/' + node.get('id'),
        type: "PATCH",
        data: JSON.stringify(data),
        accepts: self.headers["Accept"],
        contentType: self.headers["Content-Type"]
      })
      .done((data, textStatus, jqXHR) => {
        console.log(data);
        resolve(store.push('porpoiseflow/' + node.get('subclass'), data));
      })
      .fail((jqXHR, textStatus, errorThrown) => reject(errorThrown));
    });
  }
});
