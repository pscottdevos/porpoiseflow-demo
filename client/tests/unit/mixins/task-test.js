import Ember from 'ember';
import TaskMixin from '../../../mixins/task';
import { module, test } from 'qunit';

module('Unit | Mixin | task');

// Replace this with your real tests.
test('it works', function(assert) {
  var TaskObject = Ember.Object.extend(TaskMixin);
  var subject = TaskObject.create();
  assert.ok(subject);
});
