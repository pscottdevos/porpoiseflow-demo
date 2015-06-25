import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({

  taskNode: null,
  taskNodeObserver: function() {
    var taskNodePromise = this.get('model.taskNode');
    if (taskNodePromise) {
      taskNodePromise.then((taskNode) => this.set('taskNode', taskNode));
    }
  }.observes('model.taskNode'),

  nodeDef: null,
  nodeDefObserver: function() {
    var nodeDefPromise = this.get('taskNode.nodeDef');

    if (nodeDefPromise) {
      nodeDefPromise.then((nodeDef) => this.set('nodeDef', nodeDef));
    }
  }.observes('taskNode.nodeDef'),

  useCheckboxes: function() {
    return this.get('model.widgetType') === 'checkbox';
  }.property('model.widgetType'),

  useButtons: function() {
    return this.get('model.widgetType') === 'button';
  }.property('model.widgetType'),

  validChoices: function() {
    var nodeDef = this.get('nodeDef');

    if (this.get('model.widgetType') === 'text' || !nodeDef) {
      return [];
    }

    var promise = nodeDef.get('getOutgoingTransitions').bind(nodeDef)()

    .then((transitions) =>
      transitions.objectAt(0).get('output'))

    .then((gatewayDef) => {
      var subclass = gatewayDef.get('subclass');
      if (
        subclass !== 'ExclusiveGatewayDef' &&
        subclass !== 'InclusiveGatewayDef' &&
        subclass !== 'ParallelGatewayDef'
      ) { return null; }

      return gatewayDef.get('getOutgoingTransitions').bind(gatewayDef)()

      .then((validTransitions) =>
        validTransitions.map((validTransition) =>
          Ember.Object.create({
            isChecked: false,
            validTransition: validTransition
          })
        )
      );
    });

    return DS.PromiseArray.create({promise:promise});
  }.property('nodeDef', 'model.widgetType'),

  selectedChoices: function() {
    var selected = this.get('validChoices').filterBy('isChecked', true);
    var choice = this.get('model');
    var newChoices = "";
    selected.forEach(function(item, index, enumerable) {
      newChoices = newChoices + item.get('validTransition.name') + "//";
    });
    choice.set('choices', newChoices);
  }.observes('validChoices.@each.isChecked'),

});
