import Ember from 'ember';

import { moduleForModel, test } from 'ember-qunit';
import sinon from 'sinon';

import { fakeStore, emberObj as obj } from 'client/tests/helpers/utils';

moduleForModel('porpoiseflow/task-node', 'Unit | Model | porpoiseflow/task node', {
  // Specify the other units that are required for this test.
  integration: true,
});

test('assigns itself to a User', function(assert) {
  var model = this.subject();
  var adapter = obj({ assign: sinon.spy() });
  var user = obj();

  model.store = fakeStore().alwaysGetsAdapter(adapter);

  model.assign(user);

  assert.ok(model.store.adapterFor.calledWith('porpoiseflow/taskNode'));
  assert.ok(adapter.assign.calledWith(model, model.store, user));
});


test('gets its associated task, if one exists', function(assert) {
  var model = this.subject();
  var tasks = [obj({id: 42})];

  model.store = fakeStore().alwaysFinds(tasks);

  var done = assert.async();

  Ember.run(() => {
    model.set('id', 10);
    model.getTask()
    .then((task) => {
      assert.strictEqual(task.get('id'), 42);
      assert.ok(model.store.find.calledWith(
        'porpoiseflow/task', { task_node: 10 }));
      done();
    });
  });
});

test('gets no associated task, if there isn\'t one', function(assert) {
  var model = this.subject();
  var tasks = [];

  model.store = fakeStore().alwaysFinds(tasks);

  var done = assert.async();

  Ember.run(() => {
    model.set('id', 10);
    model.getTask()
    .then((task) => {
      assert.strictEqual(task, null);
      assert.ok(model.store.find.calledWith(
        'porpoiseflow/task', { task_node: 10 }));
      done();
    });
  });
});
