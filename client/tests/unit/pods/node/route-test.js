import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

import { emberObj as obj, toPromiseProxy } from 'client/tests/helpers/utils';
import fakeStore from 'client/tests/helpers/fake-store';


moduleFor('route:node', 'Unit | Route | node', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
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
