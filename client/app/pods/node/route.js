import Ember from 'ember';

import config from 'client/config/environment';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('porpoiseflow/node', params.id);
  },

  afterModel: function(model, transition) {
    if (!config.APP.USE_ANIMATIONS) {
      return this.redirectToNext(model);
    }
  },

  render: function() {
    this._super();
    if(config.APP.USE_ANIMATIONS) {
      Ember.run.later(this,
        this.redirectToNext, this.get('controller.model'),
        1000);
    }

  },

  /**
   * Finds the appropriate page for the next Node (a task page or a holding
   * page).
   */
  redirectToNext: function(node) {
    var self = this;
    if ( ['ParallelGateway', 'InclusiveGateway'].indexOf(node.get('subclass')) >= 0 ) {
      return this.replaceWith('process', node.get('process.id'));
    } else if (node.get('subclass') === 'TaskNode') {
      return node.recast()
      .then((taskNode) => taskNode.getTask()

        .then((task) => {
          var routeName = taskNode.get('taskClass').dasherize();
          if (task) {
            return self.replaceWith(routeName, task.get('id'));
          } else {
            return self.replaceWith(routeName + '/new', {queryParams: {'task_node_id': taskNode.get('id')}});
          }
        })
      );
    }
  },

});
