import { moduleForModel, test } from 'ember-qunit';

moduleForModel('auth/group', 'Unit | Model | auth/group', {
  // Specify the other units that are required for this test.
  integration: true
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
