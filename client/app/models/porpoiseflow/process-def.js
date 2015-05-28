import DS from 'ember-data';

export default DS.Model.extend({
  supercededBy: DS.belongsTo('porpoiseflow/processDef', {
    async: true,
    inverse: null
  }),

  enabled: DS.attr('boolean'),
  date: DS.attr('date'),
  name: DS.attr('string'),
  description: DS.attr('string')
});
