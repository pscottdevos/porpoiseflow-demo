import DS from 'ember-data';

export default DS.Model.extend({
  taskNode: DS.belongsTo('porpoiseflow/taskNode', {async: true}),  
});
