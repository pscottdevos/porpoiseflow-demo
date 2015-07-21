import DS from 'ember-data';

export default DS.Model.extend({
  answer: DS.belongsTo('questionnaire/answer', { async: true }),
  answerItemDef: DS.belongsTo('questionnaire/answerItemDef', { async: true }),
  text: DS.attr('string'),
});
