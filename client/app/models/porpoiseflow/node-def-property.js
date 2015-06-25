import DS from 'ember-data';

export default DS.Model.extend({
  nodeDef: DS.belongsTo('porpoiseflow/node-def', { async: true }),
  type: DS.attr('string'),
  name: DS.attr('string'),
  value: DS.attr('string')
});
