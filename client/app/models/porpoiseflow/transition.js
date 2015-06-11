import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  input: DS.belongsTo('porpoiseflow/nodeDef', {async: true}),
  output: DS.belongsTo('porpoiseflow/nodeDef', {async: true})
});
