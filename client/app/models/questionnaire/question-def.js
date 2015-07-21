import DS from 'ember-data';

export default DS.Model.extend({
  questionnaireDef: DS.belongsTo('questionnaire/questionnaireDef',
    { async: true }),
  subclass: DS.attr('string'),
  text: DS.attr('string'),
  ordering: DS.attr('number'),
  weight: DS.attr('number'),
  minAnswerCnt: DS.attr('number'),
  maxAnswerCnt: DS.attr('number'),

  answerItemDefs: function() {
    return this.store.filter('questionnaire/answerItemDef',
      { question_def: this.get('id') },
      (answerItemDef) =>
        answerItemDef.get('data.questionDef') === this.get('data.id'));
  }.property('id'),

  /**
   * Get the answer associated with this question on a given Questionnaire.
   * Answers should always be generated automatically with a Questionnaire
   * instance, so you should never need to create one yourself.
   */
  getAnswer: function(questionnaire) {
    var answerPromise = this.store.find('questionnaire/answer', {
      question_def: this.get('id'),
      questionnaire: questionnaire.get('id')
    })

    .then((answers) => {
      if (answers.get('length') > 0) {
        return answers.objectAt(0);
      }

      return null;
    });

    return DS.PromiseObject.create({
      promise: answerPromise
    });
  },

  /**
   * The name of the component to use when answering this question. The
   * component will take this model as its `questionDef` attribute, along with a
   * questionnaire.
   */
  answerFormComponentName: function() {
    var subclass = this.get('subclass');

    if (subclass === 'FreeTextQuestionDef') {
      return 'answer-form/free-text';
    }

    if (subclass === 'MultipleChoiceQuestionDef') {
      return 'answer-form/multiple-choice';
    }

    return '';
  }.property('subclass'),

});
