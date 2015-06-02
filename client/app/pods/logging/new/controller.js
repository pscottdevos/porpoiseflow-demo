import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['task_node_id'],

  actions:{
    submitText: function(){
      var loggingObject = this.get('model');
      loggingObject.save()

      .then(() =>
        this.store.find('porpoiseflow/node', 
          {next_for_actor: loggingObject.get('taskNode.process.owner.id')}))

      .then((nodes) => {
        if (nodes.get('length')) {
          return this.transitionTo('node', nodes.objectAt(0).get('id'));
        } else {
          return this.transitionTo('holding');
        }
      });
    }
  }
});
