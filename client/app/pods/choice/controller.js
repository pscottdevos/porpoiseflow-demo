import Ember from 'ember';

export default Ember.Controller.extend({

  validChoices: function() {
    console.log(this.get('model'));
    var choice = this.get('model');
    return choice.get('taskNode.nodeDef')
    
    .then((nodeDef) =>
      nodeDef.getOutgoingTransitions())

    .then((transitions) =>
      transitions.objectAt(0).get('output'))

    .then((gatewayDef) =>
      gatewayDef.getOutgoingTransitions())

    .then((validTransitions) =>
      validTransitions.map(
        (validTransition) => {
          return Ember.Object.create({
            isChecked: false,
            validTransition: validTransition
          });
        })
      );
  }.property('model'),
});
