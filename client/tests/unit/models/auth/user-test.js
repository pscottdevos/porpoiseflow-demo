import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';
import sinon from 'sinon';

import { emberObj as obj, toPromiseProxy } from 'client/tests/helpers/utils';
import fakeStore from 'client/tests/helpers/fake-store';


moduleForModel('auth/user', 'Unit | Model | auth/user', {
  // Specify the other units that are required for this test.
  integration: true
});

test('it gets the user\'s next node in a process, if available',
  function(assert) {
    var model = this.subject();
    model.store = fakeStore();

    var process = obj({
      id: 1
    });

    var node = obj({
      id: 10
    });
    node.recast = sinon.stub().returns(toPromiseProxy(node));

    model.store.findsForTypeKey('porpoiseflow/node', [node]);

    var done = assert.async();


    Ember.run(() => {
      model.set('id', 42);


      model.getNextNode(process)
      .then((finalNode) => {
        assert.ok(model.store.find.calledOnce);
        assert.strictEqual(node, finalNode);
        assert.ok(node.recast.called);
        done();
      });
    });
});

test('it gets an available node in a process, if there is no "next" node',
  function(assert) {
    var model = this.subject();
    model.store = fakeStore();

    var process = obj({
      id: 1
    });

    var node = obj({
      id: 10
    });
    node.assign = sinon.stub().returns(toPromiseProxy(node));


    model.store.findsForTypeKey('porpoiseflow/node', (id, options) => {
      if (options.available_for_actor === 42) {
        return [node];
      }

      return [];
    });


    var done = assert.async();


    Ember.run(() => {
      model.set('id', 42);

      model.getNextNode(process)
      .then((finalNode) => {
        assert.ok(model.store.find.calledTwice);
        assert.strictEqual(node, finalNode);
        assert.ok(node.assign.called);
        done();
      });
    });
});
