import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

import { fakeStore, emberObj as obj } from 'client/tests/helpers/utils';

moduleForModel('porpoiseflow/node', 'Unit | Model | porpoiseflow/node', {
  // Specify the other units that are required for this test.
  integration: true
});

test('correctly identifies its namespace', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.strictEqual(model.get('namespace'), 'porpoiseflow/');
});

test('recasts TaskNodes into their actual subclass', function(assert) {
  var model = this.subject();

  model.store = fakeStore().alwaysFinds(obj({
    isInjectedObject: true
  }));

  Ember.run(() => {
    model.set('subclass', 'TaskNode');
    model.set('id', 10);

    var done = assert.async();

    model.recast()
    .then((recasted) => {
      assert.ok(recasted.get('isInjectedObject'));

      //the important thing to test is that we went to the store looking for the
      //right TaskNode object
      assert.ok(model.store.find.calledWith('porpoiseflow/taskNode', 10));
      done();
    });
  });
});

test('does not recast if the model is not a TaskNode', function(assert) {
  var model = this.subject();

  model.store = fakeStore().alwaysFinds(obj({
    isInjectedObject: true
  }));

  Ember.run(() => {
    model.set('subclass', 'Gateway');
    model.set('id', 10);

    var done = assert.async();

    model.recast()
    .then((recasted) => {
      assert.strictEqual(recasted.get('isInjectedObject'), undefined);
      assert.ok(model.store.find.notCalled);
      done();
    });
  });
});
