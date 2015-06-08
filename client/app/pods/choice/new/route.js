import ChoiceRoute from '../route';

export default ChoiceRoute.extend({

  inProgressModel: null,

  model: function(params){
    var inProgressModel = this.get('inProgressModel');
    if (inProgressModel !== null && inProgressModel.get('id') === params.id) {
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
