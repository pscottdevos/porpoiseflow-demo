import DS from 'ember-data';

export default DS.Model.extend({
  questionDef: DS.belongsTo('questionnaire/questionDef', { async: true }),
  text: DS.attr('string'),
  ordering: DS.attr('number'),
  isOther: DS.attr('boolean'),
  score: DS.attr('number')
});
