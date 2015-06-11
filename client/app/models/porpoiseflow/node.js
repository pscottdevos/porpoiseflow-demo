import Ember from 'ember';
import DS from 'ember-data';

import Adapter from '../../adapters/application';

export default DS.Model.extend({
  process: DS.belongsTo('porpoiseflow/process', { async: true }),
  nodeDef: DS.belongsTo('porpoiseflow/nodeDef', { async: true }),
  inputs: DS.hasMany('porpoiseflow/node', {
    async: true,
    inverse: 'outputs' }),
  outputs: DS.hasMany('porpoiseflow/node', {
    async: true,
    inverse: 'inputs' }),

  actor: DS.belongsTo('auth/user', { async: true }),
  subclass: DS.attr('string'),
  createdOn: DS.attr('date'),
  startedOn: DS.attr('date'),
  completedOn: DS.attr('date'),

  assign: function(actor) {
    return Ember.$.ajax({
      type: "PATCH",
      url: new Adapter().namespace + '/' + this.get('subclass').dasherize().pluralize() + '/' + this.get('id'),
      data: {actor:actor.get('id')}
    })
    .done(() => this.reload());
  }

});
