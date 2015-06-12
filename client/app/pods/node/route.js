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
    var self = this;
    if (node.get('subclass') === 'ParallelGateway' || 
        node.get('subclass') === 'InclusiveGateway') {
      return this.replaceWith('holding');
    } else if (node.get('subclass') === 'TaskNode') {
      return this.store.find('porpoiseflow/taskNode', node.get('id'))

      .then((taskNode) => {

        // define a function to be used later
        var moveOn = function (taskNode, taskClass) {
          var routeName = Ember.String.dasherize(taskClass);
          self.store.find('porpoiseflow/task', {task_node:taskNode.get('id')})
          
          .then((tasks) => {
            if (tasks.get('length')) {
              return self.replaceWith(routeName, tasks.objectAt(0).get('id'));
            } else {
              return self.replaceWith(routeName + '/new', {queryParams: {'task_node_id': taskNode.get('id')}});
            }
          });
        };

        var taskClass = taskNode.get('taskClass');
        if (taskClass) {
          return moveOn(taskNode, taskClass);
        } else {
          return taskNode.reload()
          .then((taskNode) => {
            var taskClass = taskNode.get('taskClass');
            return moveOn(taskNode, taskClass);
          });
        }
      });
    }
  },

});
