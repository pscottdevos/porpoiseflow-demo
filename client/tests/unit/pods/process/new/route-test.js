import { moduleFor, test } from 'ember-qunit';

import fakeStore from 'client/tests/helpers/fake-store';
import { emberObj as obj, toPromiseProxy } from 'client/tests/helpers/utils';

import sinon from 'sinon';

moduleFor('route:process/new', 'Unit | Route | process/new', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it creates a process for its model, and preloads the def and user',
  function(assert) {
    var route = this.subject();
    var store = fakeStore()
    .findsForTypeKey('porpoiseflow/processDef', obj({id: 1}))
    .findsForTypeKey('auth/user', obj({id: 2}));
    
    route.store = store;

    route.model({process_def_id: 1, user_id: 2})
    .then((createdProcess) => {
      assert.ok(store.find.calledTwice);

      assert.strictEqual(createdProcess.get('processDef.id'), 1);
      assert.strictEqual(createdProcess.get('owner.id'), 2);
    });
  }
);

test('it saves the new process and redirects to its page', function(assert) {
  var route = this.subject();

  var process = obj();
  process.save = sinon.stub().returns(toPromiseProxy(process));

  var replaceWithStub = sinon.stub(route, 'replaceWith');

  route.persistAndRedirect(process)
  .then(() => {
    assert.ok(process.save.called);
    assert.ok(replaceWithStub.called);
  });
});