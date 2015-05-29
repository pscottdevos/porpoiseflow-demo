import DS from 'ember-data';
import Node from './node';

export default Node.extend({
  taskClass: DS.attr('string'),
  task: DS.belongsTo('porpoiseflow/task', { async: true }),
});
