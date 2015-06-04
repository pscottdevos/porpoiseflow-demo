import Ember from 'ember';

export default Ember.Route.extend({
  inProgressModel: null,

  model: function(params){
    return this.store.find('demo/choice', params.id);
  },

  actions:{
    submitChoice: function(){
      var process;
      var choiceObject = this.get('controller.model');
      choiceObject.save()

      .then(() => this.set('inProgressModel', null))

      .then(() => choiceObject.get('taskNode'))

      .then((taskNode) => taskNode.get('process'))

      .then((fetchedProcess) => {
        process = fetchedProcess;
        return process.get('owner');
      })

      .then((owner) =>
        this.store.find('porpoiseflow/node',
          {next_for_actor: owner.get('id')}))

      .then((nodes) => {
        if (nodes.get('length')) {
          return this.transitionTo('node', nodes.objectAt(0).get('id'));
        } else {
          return this.transitionTo('process', process.get('id'));
        }
      });
    }
  }
});
