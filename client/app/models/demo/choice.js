import DS from 'ember-data';
import Task from '../porpoiseflow/task';

export default Task.extend({
  choices: DS.attr('string'),
  multiple_choice: DS.attr('string', { defaultValue: 'true' })
});
