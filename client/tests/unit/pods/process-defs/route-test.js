import { moduleFor, test } from 'ember-qunit';
import fakeStore from 'client/tests/helpers/fake-store';
import { emberObj as obj } from 'client/tests/helpers/utils';

moduleFor('route:process-defs', 'Unit | Route | process defs', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it sorts process defs by name', function(assert) {
  var route = this.subject();

  route.store = fakeStore().alwaysFinds([
    obj({name: 'foo'}),
    obj({name: 'bar'}),
  ]);

  route.model({})
  .then((processDefs) => {
    assert.strictEqual(processDefs.objectAt(0).get('name'), 'bar');
    assert.strictEqual(processDefs.objectAt(1).get('name'), 'foo');
  });
});
