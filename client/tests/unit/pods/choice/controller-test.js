import { moduleFor, test } from 'ember-qunit';
import { emberObj as obj, toPromiseProxy } from 'client/tests/helpers/utils';

import sinon from 'sinon';

moduleFor('controller:choice', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

// Replace this with your real tests.
test('it finds valid choices for its model', function(assert) {
  var controller = this.subject();
  
  //this "diagram" goes from model, to an Exclusive Gateway, to three outgoing
  //transitions called "foo", "bar", and "baz"

  var validTransitions = [ obj({name: 'foo'}), obj({name: 'bar'}),
    obj({name: 'baz'})];

  var transitionAfterChoice = obj({
    output: obj({
      subclass: 'ExclusiveGatewayDef',
      getOutgoingTransitions: sinon.spy(() =>
        toPromiseProxy(validTransitions))
    })
  });

  // transitionAfterChoice.get('output').getOutgoingTransitions

  var model = obj({
    taskNode: obj({
      nodeDef: toPromiseProxy(obj({
        getOutgoingTransitions: sinon.spy(() =>
          toPromiseProxy([transitionAfterChoice]))
      }))
    })
  });

  controller.set('model', model);


  controller.get('validChoices')

  .then((validChoices) => {
    assert.ok(model.get('taskNode.nodeDef.getOutgoingTransitions').called);
    assert.ok(
      transitionAfterChoice.get('output.getOutgoingTransitions').called);

    assert.strictEqual(validChoices.get('length'), 3);
    assert.strictEqual(validChoices.objectAt(2).get('validTransition.name'),
      'baz');
    assert.strictEqual(validChoices.objectAt(2).get('isChecked'), false);

  });
});

test('it builds the currently selected choices into a string',
  function(assert) {
    var controller = this.subject();

    controller.set('model', obj({choices: ''}));

    //this "overwrites" validChoices with a static value, disabling its
    //computed property-ness for the duration of the test:
    controller.set('validChoices', [
      obj({isChecked: true, validTransition: obj({name: 'foo'})}),
      obj({isChecked: false, validTransition: obj({name: 'bar'})}),
      obj({isChecked: true, validTransition: obj({name: 'baz'})}),
    ]);

    assert.strictEqual(controller.get('model.choices'), 'foo baz ');
  }
);
