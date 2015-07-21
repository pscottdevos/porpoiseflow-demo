import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  createdOn: DS.attr('date'),
  createdBy: DS.belongsTo('base/user', { async: true }),
  questionDefs: DS.hasMany('questionnaire/questionDef', { async: true }),
});
