import Ember from 'ember';
import RoutesTaskMixin from 'client/mixins/routes/task';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

import fakeStore from 'client/tests/helpers/fake-store';
import { emberObj as obj, toPromiseProxy } from 'client/tests/helpers/utils';

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

moduleFor('mixin:routes/task', 'Unit | Mixin | routes/task', {
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

    sinon.stub(subject, 'createTaskFor');

    subject.taskModel('some-task-model', {id: 1, task_node_id: 10})

    .then((taskModel) => {
      sinon.assert.calledWith(subject.get('store').find,
        'porpoiseflow/taskNode', 10);
      sinon.assert.called(subject.createTaskFor);
    });
  });

test('it creates a new model and calls the hook to set properties',
  function(assert) {
    subject.set('store', fakeStore());

    var prop = obj({fooBar: obj({name: 'foo_bar', value: 42})});

    var taskNode = obj({
      nodeDef: toPromiseProxy(obj({
        nodeDefProperties: toPromiseProxy(prop)
      }))
    });

    subject.setNodeDefProperties = function(model, properties) {
      model.set('fooBar', properties.get('fooBar.value'));
    };

    subject.createTaskFor('some-model', taskNode)
    .then((createdModel) => {
      assert.strictEqual(createdModel.get('taskNode'), taskNode);
      assert.strictEqual(createdModel.get('fooBar'), 42);
    });
  });

test('it submits the task model', function(assert) {
  var fakeObject = setupDoSubmit(subject);

  subject.doSubmit()
  .then(() => {
    assert.ok(subject.transitionTo.calledWith('node', 42));
  });
});

test('it shows an alert message if a submit fails', function(assert) {
  var fakeObject = setupDoSubmit(subject);
  fakeObject.save = () => Ember.RSVP.reject({message: "epic fail"});


  subject.doSubmit()
  .then(() => {
    assert.ok(alertStub.called);

    //this is fine because the "next node" should still be this node
    assert.ok(subject.transitionTo.calledWith('node', 42));
  });
});

test('it transitions to the process after submit if there is no next node',
  function(assert) {
    var fakeObject = setupDoSubmit(subject);
    fakeObject.getNextNode = () => null;

    subject.doSubmit()
    .then(() => {
      assert.ok(subject.transitionTo.calledWith('process', 42));
    });
  });
