import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

import { emberObj as obj, toPromiseProxy } from 'client/tests/helpers/utils';
import fakeStore from 'client/tests/helpers/fake-store';

moduleFor('controller:choice', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

// Replace this with your real tests.
test('it finds valid choices for its model', function(assert) {
  var controller = this.subject();
  controller.store = fakeStore().alwaysFinds([obj()]);

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

  var nodeDef = obj({
      isSettled: true,
      nodeDefProperties: toPromiseProxy(obj()),
      getOutgoingTransitions: sinon.spy(() =>
        toPromiseProxy([transitionAfterChoice]))
    });

  controller.set('model', obj());
  controller.set('nodeDef', nodeDef);
  controller.set('widgetType', 'checkbox');

  controller.get('validChoices')

  .then((validChoices) => {
    assert.ok(nodeDef.get('getOutgoingTransitions').called);
    assert.ok(
      transitionAfterChoice.get('output.getOutgoingTransitions').called);

    assert.strictEqual(validChoices.get('length'), 3);
    assert.strictEqual(validChoices.objectAt(2).get('validTransition.name'),
      'foo');
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

    assert.strictEqual(controller.get('model.choices'), 'foo//baz//');
  }
);

test('it selects the correct choice widget',
  function(assert) {
    var controller = this.subject();

    controller.set('model', obj());

    controller.set('model.widgetType', 'checkbox');

    assert.ok(controller.get('useCheckboxes'));
    assert.ok(!controller.get('useButtons'));

    controller.set('model.widgetType', 'button');

    assert.ok(!controller.get('useCheckboxes'));
    assert.ok(controller.get('useButtons'));
  }
);


