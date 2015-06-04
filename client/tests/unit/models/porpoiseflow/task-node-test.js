import { moduleForModel, test } from 'ember-qunit';

moduleForModel('porpoiseflow/task-node', 'Unit | Model | porpoiseflow/task node', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
