import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

import config from 'client/config/environment';
import { emberObj as obj, toPromiseProxy } from 'client/tests/helpers/utils';
import fakeStore from 'client/tests/helpers/fake-store';

var runLaterStub, useAnimationsCache;

moduleFor('route:node', 'Unit | Route | node', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  setup: function() {
    useAnimationsCache = config.APP.USE_ANIMATIONS;
    runLaterStub = sinon.stub(Ember.run, 'later');
  },

  teardown: function() {
    runLaterStub.restore();
    config.APP.USE_ANIMATIONS = useAnimationsCache;
  }
});

test('it retrieves its model', function(assert) {
  var route = this.subject();
  route.store.find = sinon.spy();

  route.model({id: 5});
  assert.ok(route.store.find.calledWith('porpoiseflow/node', 5));
});

test('it redirects from a blocking gateway to the process route',
  function(assert) {
    var route = this.subject();
    route.replaceWith = sinon.spy();

    var node = obj({
      id: 10,
      subclass: 'ParallelGateway'
    });

    route.redirectToNext(node);
    assert.ok(route.replaceWith.calledWith('process', node.get('process.id')));
  });

test("it redirects to an existing task's route", function(assert) {
  var route = this.subject();
  route.replaceWith = sinon.spy();

  var task = obj({
    id: 100
  });

  var node = obj({
    id: 10,
    subclass: 'TaskNode',
    taskClass: 'taskClass'
  });
  node.recast = sinon.stub().returns(toPromiseProxy(node));
  node.getTask = sinon.stub().returns(toPromiseProxy(task));

  route.redirectToNext(node)
  .then(() => {
    assert.ok(route.replaceWith.calledWith('task-class', 100));
  });
});

test('it redirects to a new task route', function(assert) {
  var route = this.subject();
  route.replaceWith = sinon.spy();

  var node = obj({
    id: 10,
    subclass: 'TaskNode',
    taskClass: 'taskClass'
  });
  node.recast = sinon.stub().returns(toPromiseProxy(node));
  node.getTask = sinon.stub().returns(toPromiseProxy(null));

  route.redirectToNext(node)
  .then(() => {
    assert.ok(route.replaceWith.calledWith(
      'task-class/new', {queryParams: {'task_node_id': node.get('id')}}));
  });
});

test('it redirects immediately if animations are off', function(assert) {
  var route = this.subject();
  config.APP.USE_ANIMATIONS = false;

  var model = obj();

  sinon.stub(route, 'redirectToNext');

  route.afterModel(model, null);

  assert.ok(route.redirectToNext.calledWith(model),
    'redirectToNext should be called');
});

test('it schedules a redirect for later if animations are on',
  function(assert) {
    var route = this.subject();
    config.APP.USE_ANIMATIONS = true;

    sinon.stub(route, 'redirectToNext');
    sinon.stub(route, '_super');

    route.render();

    assert.ok(runLaterStub.called, 'Ember.run.later should be called');
    assert.ok(route.redirectToNext.notCalled,
      'redirectToNext should not be called');
  }
);