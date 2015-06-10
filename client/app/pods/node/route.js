import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('porpoiseflow/node', params.id);
  },

  render: function() {
    this._super();
    Ember.run.later(this, this.redirectToNext, this.get('controller.model'),
      1000);
  },

  /**
   * Finds the appropriate page for the next Node (a task page or a holding
   * page).
   */
  redirectToNext: function(node) {
    if (node.get('subclass') === 'ParallelGateway') {
      return this.replaceWith('holding');
    } else if (node.get('subclass') === 'TaskNode') {
      var taskNode;
      return this.store.find('porpoiseflow/taskNode', node.get('id'))

      .then((tmpTaskNode) => {
        taskNode = tmpTaskNode;
        var taskClass = taskNode.get('taskClass');
        var routeName = Ember.String.dasherize(taskClass);
        this.store.find('porpoiseflow/task', {task_node:taskNode.get('id')})
        
        .then((tasks) => {
          if (tasks.get('length')) {
            return this.replaceWith(routeName, tasks.objectAt(0).get('id'));
          } else {
            return this.replaceWith(routeName + '/new', {queryParams: {'task_node_id': taskNode.get('id')}});
          }
        });
      });
    }
  },

});
