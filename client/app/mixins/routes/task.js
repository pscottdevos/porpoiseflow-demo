import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Mixin.create(AuthenticatedRouteMixin, {
  inProgressModel: null,

  queryParams: {
    task_node_id: { refreshModel: true }
  },

  taskModel: function(modelName, params){
    var promise;
    var inProgressModel = this.get('inProgressModel');
    if (inProgressModel !== null && inProgressModel.get('id') === params.id) {
      return this.get('inProgressModel');
    }
    if (params.task_node_id) {
      return this.store.find('porpoiseflow/taskNode', params.task_node_id)

      .then((taskNode) => {
        return this.createTaskFor(modelName, taskNode);
      });
    } else {
      return this.store.find(modelName, params.id)
      .then((task) => {
        this.set('inProgressModel', task);
        return task;
      });
    }
  },

  /**
   * Create and return a new instance of modelName for taskNode, after assigning
   * any node def properties. Returns a Promise.
   */
  createTaskFor: function(modelName, taskNode) {
    var task = this.store.createRecord(modelName, {
      taskNode: taskNode
    });
    this.set('inProgressModel', task);
    return taskNode.get('nodeDef')
    .then((nodeDef) => nodeDef.get('nodeDefProperties'))
    .then((properties) => {
      this.setNodeDefProperties(task, properties);
      return task;
    });
  },

  /**
   * Assign node def properties to a newly-created model instance as
   * appropriate (given a model instance and an object containing
   * node def proprties). Does nothing by default.
   * @param {Task} model
   * @param {[type]} nodeDefProperties resolved result of
   *                                   nodeDef.get('nodeDefProperties')
   */
  setNodeDefProperties: function(model, nodeDefProperties) { },

  doSubmit: function(){
    var task = this.get('controller.model');

    return task.save()
    .catch((error) => {
      var msg = 'Your task was not saved because of the following:\n\n' +
        error.message + '\n\nAn attempt will be made to continue.';
      return window.alert(msg);
    })
    .then(() => this.set('inProgressModel', null))
    .then(() => task.get('taskNode'))
    .then((taskNode) => taskNode.get('process'))
    .then((process) => this.transitionTo('process', process.get('id')));

  }
});
