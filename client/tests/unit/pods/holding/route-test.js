import { moduleFor, test } from 'ember-qunit';
import fakeStore from 'client/tests/helpers/fake-store';
import { emberObj as obj } from 'client/tests/helpers/utils';

moduleFor('route:holding', 'Unit | Route | holding', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('model returns a process if passed an id', function(assert) {
  var route = this.subject();
  
  route.store = fakeStore().alwaysFinds(obj({isInjectedObject: true}));

  route.model({process_id: 10})
  .then((model) => {
    assert.ok(model.get('isInjectedObject'));
    assert.ok(route.store.find.calledWith('porpoiseflow/process', 10));
  });
});

test('model returns null if not passed an id', function(assert) {
  var route = this.subject();
  
  route.store = fakeStore().alwaysFinds(obj({isInjectedObject: true}));

  assert.strictEqual(route.model({}), null);

  assert.ok(route.store.find.notCalled);
});
