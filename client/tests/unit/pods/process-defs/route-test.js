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
    obj({name: 'cc'}),
    obj({name: 'bb'}),
    obj({name: 'aa'})
  ]);
  
  route.model({})
  .then((processDefs) => {
    assert.strictEqual(processDefs.objectAt(0).get('name'), 'aa');
    assert.strictEqual(processDefs.objectAt(1).get('name'), 'bb');
    assert.strictEqual(processDefs.objectAt(2).get('name'), 'cc');
  });
});
