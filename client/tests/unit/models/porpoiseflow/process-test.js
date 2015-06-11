import { moduleForModel, test } from 'ember-qunit';

moduleForModel('porpoiseflow/process', 'Unit | Model | porpoiseflow/process', {
  // Specify the other units that are required for this test.
  integration: true
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
