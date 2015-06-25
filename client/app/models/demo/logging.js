import DS from 'ember-data';
import Task from '../porpoiseflow/task';

export default Task.extend({
  text: DS.attr('string'),
  widgetType: DS.attr('string', { defaultValue: 'text' })
});
