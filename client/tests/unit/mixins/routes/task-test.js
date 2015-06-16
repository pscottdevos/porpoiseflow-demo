import Ember from 'ember';
import RoutesTaskMixin from 'client/mixins/routes/task';
import { module, test } from 'qunit';
import { fakeStore, emberObj as obj,
  toPromiseProxy } from 'client/tests/helpers/utils';
import sinon from 'sinon';

var setupDoSubmit = (taskRoute) => {
  //doSubmit requires a long chain of promises and resolutions
  //to test this, we make one object with a bunch of PromiseObject properties,
  //all of which refer back to the object itself.

  //this is ugly, but I haven't come up with any better ideas yet
  var fakeObject = obj({
    id: 42
  });

  var fakeObjectPromise = toPromiseProxy(fakeObject);

  fakeObject.save = () => fakeObjectPromise;
  fakeObject.set('taskNode', fakeObjectPromise);
  fakeObject.set('process', fakeObjectPromise);
  fakeObject.set('actor', fakeObjectPromise);
  fakeObject.getNextNode = () => fakeObjectPromise;

  taskRoute.set('controller', obj({model: fakeObject}));
  taskRoute.set('inProgressModel', fakeObject);
  taskRoute.transitionTo = sinon.stub().returns(fakeObjectPromise);

  return fakeObject;
};

var alertStub;
var subject;

module('Unit | Mixin | routes/task', {
  setup: () => {
    var TaskObject = Ember.Object.extend(RoutesTaskMixin);
    subject = TaskObject.create();

    alertStub = sinon.stub(window, 'alert');
  },
  teardown: () => alertStub.restore()
});

// Replace this with your real tests.
test('it uses the "in progress" model if it matches the route',
  function(assert) {
    subject.set('inProgressModel', obj({
      id: 0
    }));

    assert.strictEqual(
      subject.taskModel('some-task-model', {id: 0}).get('id'),
      0);
  });

test('it disregards the "in progress" model if it does not match the route',
  function(assert) {
    subject.set('store', fakeStore().alwaysFinds(obj({
      id: 10
    })));
    subject.set('inProgressModel', obj({
      id: 0
    }));

    var done = assert.async();

    subject.taskModel('some-task-model', {id: 1, task_node_id: 10})

    .then((taskModel) => {
      assert.ok(subject.get('store').findCalledWith(
        'porpoiseflow/taskNode', 10));
      assert.strictEqual(taskModel.get('taskNode.id'), 10);
      done();
    });
  });

test('it submits the task model', function(assert) {
  var fakeObject = setupDoSubmit(subject);

  var done = assert.async();

  subject.doSubmit()
  .then(() => {
    assert.ok(subject.transitionTo.calledWith('node', 42));
    done();
  });
});

test('it shows an alert message if a submit fails', function(assert) {
  var fakeObject = setupDoSubmit(subject);
  fakeObject.save = () => Ember.RSVP.reject({message: "epic fail"});

  var done = assert.async();

  subject.doSubmit()
  .then(() => {
    assert.ok(alertStub.called);

    //this is fine because the "next node" should still be this node
    assert.ok(subject.transitionTo.calledWith('node', 42));
    done();
  });
});

test('it transitions to the process after submit if there is no next node',
  function(assert) {
    var fakeObject = setupDoSubmit(subject);
    fakeObject.getNextNode = () => null;

    var done = assert.async();

    subject.doSubmit()
    .then(() => {
      assert.ok(subject.transitionTo.calledWith('process', 42));
      done();
    });
  });
