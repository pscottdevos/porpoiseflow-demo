import { moduleForModel, test } from 'ember-qunit';

moduleForModel('porpoiseflow/parallel-gateway', 'Unit | Model | porpoiseflow/parallel gateway', {
  // Specify the other units that are required for this test.
  integration: true,
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
