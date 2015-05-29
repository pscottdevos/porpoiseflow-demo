import DS from 'ember-data';

export default DS.Model.extend({
  processDef: DS.belongsTo('porpoiseflow/processDef', { async: true }),
  lane: DS.belongsTo('porpoiseflow/group', { async: true }),

  subclass: DS.attr('string'),

  bpmn_id: DS.attr('string'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  joinMode: DS.attr('string'),
  splitMode: DS.attr('string'),
  isMultiInstance: DS.attr('boolean'),
});
