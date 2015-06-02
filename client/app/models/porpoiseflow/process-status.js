import DS from 'ember-data';

export default DS.Model.extend({
  process: DS.belongsTo('porpoiseflow/process', { async: true }),
  name: DS.attr('string'),
  actor: DS.belongsTo('auth/user', { async: true }),
  as_of: DS.attr('date'),
});
