import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['task_node_id'],

  actions:{
    submitText: function(){
      var process;
      var loggingObject = this.get('model');
      loggingObject.save()

      .then(() => loggingObject.get('taskNode'))

      .then((taskNode) => taskNode.get('process'))

      .then((fetchedProcess) => {
        process = fetchedProcess
        return process.get('owner')
      })

      .then((owner) =>
        this.store.find('porpoiseflow/node', 
          {next_for_actor: owner.get('id')}))

      .then((nodes) => {
        if (nodes.get('length')) {
          return this.transitionTo('node', nodes.objectAt(0).get('id'));
        } else {
          return this.transitionTo('holding', {
            queryParams: {process_id: process.get('id')}
          });
        }
      });
    }
  }
});
