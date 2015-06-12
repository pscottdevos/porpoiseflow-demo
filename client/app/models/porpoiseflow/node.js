import Ember from 'ember';
import DS from 'ember-data';


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
    var adapter = this.store.adapterFor('porpoiseflow/node');
    return adapter.assign(this, this.store, actor);
  }

});
