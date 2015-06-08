import Ember from 'ember';

export default Ember.Route.extend({
  inProgressModel: null,

  model: function(params){
    return this.store.find('demo/logging', params.id);
  },
  
  renderTemplate: function() {
    this.render('logging');
  },

  actions:{
    submitText: function(){
      var process;
      var loggingObject = this.get('controller.model');
      loggingObject.save()

      .then(() => this.set('inProgressModel', null))

      .then(() => loggingObject.get('taskNode'))

      .then((taskNode) => taskNode.get('process'))

      .then((fetchedProcess) => {
        process = fetchedProcess;
        return process.get('owner');
      })

      .then((owner) =>
        this.store.find('porpoiseflow/node', 
          {next_for_actor: owner.get('id'), process:process.get('id')}
        )
      )

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
