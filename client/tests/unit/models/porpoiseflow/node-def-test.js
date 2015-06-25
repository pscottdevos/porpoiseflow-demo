import { moduleForModel, test } from 'ember-qunit';

import { toPromiseProxy, emberObj as obj } from 'client/tests/helpers/utils';
import fakeStore from 'client/tests/helpers/fake-store';

moduleForModel('porpoiseflow/node-def', 'Unit | Model | porpoiseflow/node def', {
  // Specify the other units that are required for this test.
  integration: true
});

test('it retrieves its properties as a PromiseObject', function(assert) {
  var model = this.subject();

  var fooProp = obj({name: 'foo', value: 'some value'});
  var barProp = obj({name: 'bar', value: 'other value'});

  model.store = fakeStore().alwaysFinds([fooProp, barProp]);

  model.set('id', 42);

  model.get('nodeDefProperties')
  .then((properties) => {
    assert.ok(model.store.find.called, 'store.find should be called');

    assert.strictEqual(properties.get('foo'), fooProp);
    assert.strictEqual(properties.get('bar'), barProp);
  });
});
