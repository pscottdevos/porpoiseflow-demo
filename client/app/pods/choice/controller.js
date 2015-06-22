import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({

  validChoices: function() {
    var choice = this.get('model');
    var nodeDef;

    var promise = choice.get('taskNode.nodeDef')
    
    .then((fetchedNodeDef) => {
      // first, figure out if we display checkboxes at all
      nodeDef = fetchedNodeDef;
      return this.store.find('porpoiseflow/node-def-property', {
        node_def: nodeDef.get('id'),
        name: 'multiple_choice'
      })

      .then((nodeProperties) => {
        if (nodeProperties.get('length') > 0) {
          var nodeProperty = nodeProperties.objectAt(0);
          if (nodeProperty.get('value') === 'false') {
            return [];
          }
        }

        // multiple_choice == true  => find transitions to use as choices
        return nodeDef.getOutgoingTransitions()

        .then((transitions) =>
          transitions.objectAt(0).get('output'))

        .then((gatewayDef) => {
          var subclass= gatewayDef.get('subclass');
          if (
            subclass !== 'ExclusiveGatewayDef' &&
            subclass !== 'InclusiveGatewayDef' &&
            subclass !== 'ParallelGatewayDef'
          ) { return null; }
          return gatewayDef.getOutgoingTransitions()

          .then((validTransitions) =>
            validTransitions.map((validTransition) => {
              return Ember.Object.create({
                isChecked: false,
                validTransition: validTransition
              });
            })
          );
        });
      });
    });

    return DS.PromiseArray.create({promise:promise});
  }.property('model'),

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
