import DS from 'ember-data';
import Task from '../porpoiseflow/task';

export default Task.extend({
  choices: DS.attr('string'),
  widget_type: DS.attr('string', { defaultValue: 'checkbox' })
});
