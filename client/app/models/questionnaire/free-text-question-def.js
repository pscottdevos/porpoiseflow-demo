import QuestionDef from './question-def';
import DS from 'ember-data';

export default QuestionDef.extend({
  allowBlank: DS.attr('boolean'),
});
