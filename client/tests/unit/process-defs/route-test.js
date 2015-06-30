import { moduleFor, test } from 'ember-qunit';
import fakeStore from 'client/tests/helpers/fake-store';

moduleFor('route:process-defs', 'Unit | Route | process defs', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it sorts process defs by name', function(assert) {
  var route = this.subject();

  route.store = fakeStore().alwaysFinds([]);
  
  route.model({})
  .then((processDefs) => {
    assert.deepEqual(processDefs.get('sortProperties'), ['name']);
    assert.strictEqual(processDefs.get('sortAscending'), true);
  });
});
