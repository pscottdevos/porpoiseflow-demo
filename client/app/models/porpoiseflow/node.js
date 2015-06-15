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
    var adapter = this.store.adapterFor(this.constructor.typeKey);
    return adapter.assign(this, this.store, actor);
  },

  namespace: function() {
    var typeComponents = this.constructor.typeKey.split('/');
    return typeComponents.slice(0, -1).join('/') + '/';
  }.property(),

  recast: function() {
    if (this.get('subclass') === 'TaskNode') {
      return this.store.find(this.get('namespace') + this.get('subclass'), this.get('id'));
    } else {
      return this;
    }
  }

});
