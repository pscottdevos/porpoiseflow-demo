import DS from 'ember-data';
import Task from '../porpoiseflow/task';

export default Task.extend({
  questionnaireDef: DS.belongsTo('questionnaire/questionnaireDef',
    { async: true }),
  finalized: DS.attr('boolean'),
});
