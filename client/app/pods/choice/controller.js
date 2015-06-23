import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({

  taskNode: function() {
    return this.get('model.taskNode');
  }.property('model.taskNode.isSettled'),

  nodeDef: function() {
    return this.get('taskNode.nodeDef');
  }.property('taskNode.nodeDef.isSettled'),

  //valid values are 'checkbox' or 'text'
  widgetType: 'checkbox',

  /**
   * Sets widgetType once the required nodeDefProperty comes in from the server.
   */
  widgetTypeSetter: function() {
    var nodeDef = this.get('nodeDef');

    if (!nodeDef || !nodeDef.get('isSettled')) {
      return;
    }

    return this.store.find('porpoiseflow/node-def-property', {
      node_def: nodeDef.get('id'),
      name: 'widget_type'
    })

    .then((nodeProperties) => {
      if (nodeProperties.get('length') > 0) {
        var nodeProperty = nodeProperties.objectAt(0);
        this.set('widgetType', nodeProperty.get('value'));
      }
    });
  }.observes('nodeDef.isSettled'),

  validChoices: function() {
    var nodeDef = this.get('nodeDef');

    if (this.get('widgetType') !== 'checkbox' || !nodeDef.get('isSettled')) {
      return [];
    }

    var promise = nodeDef.getOutgoingTransitions()

    .then((transitions) =>
      transitions.objectAt(0).get('output'))

    .then((gatewayDef) => {
      var subclass = gatewayDef.get('subclass');
      if (
        subclass !== 'ExclusiveGatewayDef' &&
        subclass !== 'InclusiveGatewayDef' &&
        subclass !== 'ParallelGatewayDef'
      ) { return null; }

      return gatewayDef.getOutgoingTransitions()

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
  }.property('nodeDef.isSettled', 'widgetType'),

  selectedChoices: function() {
    var selected = this.get('validChoices').filterBy('isChecked', true);
    var choice = this.get('model');
    var newChoices = "";
    selected.forEach(function(item, index, enumerable) {
      newChoices = newChoices + item.get('validTransition.name') + " ";
    });
    choice.set('choices', newChoices);
  }.observes('validChoices.@each.isChecked'),

});
