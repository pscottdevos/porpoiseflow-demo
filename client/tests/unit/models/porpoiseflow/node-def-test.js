import { moduleForModel, test } from 'ember-qunit';

moduleForModel('porpoiseflow/node-def', 'Unit | Model | porpoiseflow/node def', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
