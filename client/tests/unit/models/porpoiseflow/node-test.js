import { moduleForModel, test } from 'ember-qunit';

moduleForModel('porpoiseflow/node', 'Unit | Model | porpoiseflow/node', {
  // Specify the other units that are required for this test.
  integration: true
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
