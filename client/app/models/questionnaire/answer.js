import DS from 'ember-data';

export default DS.Model.extend({
  questionDef: DS.belongsTo('questionnaire/questionDef', { async: true }),
  questionnaire: DS.belongsTo('questionnaire/questionnaire',
    { async: true }),
  score: DS.attr('number'),
  scoredOn: DS.attr('date'),


  //WARNING: because answerItems/answerItemDefs are properties, they'll be
  //cached. I'm not sure how similar/dissimilar that is to, say, a hasMany
  //relation, but if you have problems with items or defs not showing up, I'd
  //start by looking at these.

  answerItems: function() {
    return this.store.filter('questionnaire/answerItem',
      { answer: this.get('id') },
      (answerItem) => answerItem.get('data.answer') === this.get('data.id')
    );
  }.property('id'),

  answerItemsLength: function() {
    return this.get('answerItems.length');
  }.property('answerItems.@each'),

  answerItemDefs: function() {
    return this.store.filter('questionnaire/answerItemDef',
      { question_def: this.get('data.questionDef') },
      (answerItemDef) => 
        answerItemDef.get('data.questionDef') ===
        this.get('data.questionDef'));
  }.property('questionDef')
});
