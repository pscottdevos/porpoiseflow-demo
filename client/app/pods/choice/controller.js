import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({

  validChoices: function() {
    var choice = this.get('model');
    var promise = choice.get('taskNode.nodeDef')
    
    .then((nodeDef) =>
      nodeDef.getOutgoingTransitions())

    .then((transitions) =>
      transitions.objectAt(0).get('output'))

    .then((gatewayDef) =>
      gatewayDef.getOutgoingTransitions())

    .then((validTransitions) => {
      return validTransitions.map(
        (validTransition) => {
          return Ember.Object.create({
            isChecked: false,
            validTransition: validTransition
          });
        })
    });

    return DS.PromiseArray.create({promise:promise})
  }.property('model'),

});
