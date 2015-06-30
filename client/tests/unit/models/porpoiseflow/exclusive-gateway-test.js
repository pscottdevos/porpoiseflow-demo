import { moduleForModel, test } from 'ember-qunit';

moduleForModel('porpoiseflow/exclusive-gateway', 'Unit | Model | porpoiseflow/exclusive gateway', {
  // Specify the other units that are required for this test.
  integration: true,
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
