import Ember from 'ember';
import RoutesTaskMixin from '../../../mixins/routes/task';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/task');

// Replace this with your real tests.
test('it works', function(assert) {
  var RoutesTaskObject = Ember.Object.extend(RoutesTaskMixin);
  var subject = RoutesTaskObject.create();
  assert.ok(subject);
});
