import DS from 'ember-data';
import Node from './node';

export default Node.extend({
  taskClass: DS.attr('string'),
  task: DS.belongsTo('porpoiseflow/task', { async: true }),

  getTask: function() {
    return this.store.find('porpoiseflow/task', { task_node: this.get('id') })
    .then((tasks) => tasks.get('length') ? tasks.objectAt(0) : null);
  }

});
