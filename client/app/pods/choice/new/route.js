import ChoiceRoute from '../route';

export default ChoiceRoute.extend({

  inProgressModel: null,

  model: function(params){
    if (this.get('inProgressModel') !== null){
      return this.get('inProgressModel');
    }
    return this.store.find('porpoiseflow/taskNode', params.task_node_id)

    .then((taskNode) => {
      var choice = this.store.createRecord('demo/choice', {
        taskNode: taskNode
      });
      this.set('inProgressModel', choice);
      return choice;
    });
  },

});
