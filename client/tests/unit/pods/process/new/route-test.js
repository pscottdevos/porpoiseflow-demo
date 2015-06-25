import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';
import config from 'client/config/environment';

import fakeStore from 'client/tests/helpers/fake-store';
import { emberObj as obj, toPromiseProxy } from 'client/tests/helpers/utils';

var runLaterStub, useAnimationsCache;

moduleFor('route:process/new', 'Unit | Route | process/new', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  setup: function() {
    runLaterStub = sinon.stub(Ember.run, 'later');

    //this lets us override USE_ANIMATIONS during tests if we need to
    useAnimationsCache = config.APP.USE_ANIMATIONS;
  },

  teardown: function() {
    config.APP.USE_ANIMATIONS = useAnimationsCache;

    runLaterStub.restore();
  }
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

test('it saves immediately if animations are off', function(assert) {
  var route = this.subject();

  config.APP.USE_ANIMATIONS = false;  

  var model = obj();
  sinon.stub(route, 'persistAndRedirect').returns('arbitrary return value');
  sinon.stub(route, '_super');

  var result = route.afterModel(model, null);
  route.render();

  assert.ok(route.persistAndRedirect.calledWith(model),
    'persistAndRedirect was called');
  assert.ok(runLaterStub.notCalled, 'Ember.run.later was not called');
});

test('it waits to save if animations are on', function(assert) {
  var route = this.subject();

  config.APP.USE_ANIMATIONS = true;  

  var model = obj();
  sinon.stub(route, 'persistAndRedirect').returns('arbitrary return value');
  sinon.stub(route, '_super');

  var result = route.afterModel(model, null);
  route.render();

  assert.ok(route.persistAndRedirect.notCalled,
    'persistAndRedirect was not called');
  assert.ok(runLaterStub.called, 'Ember.run.later was called');
});

