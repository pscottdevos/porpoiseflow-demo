import Ember from 'ember';

import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

import fakeStore from 'client/tests/helpers/fake-store';
import { emberObj as obj, toPromiseProxy } from 'client/tests/helpers/utils';

var runLaterStub;
var runCancelStub;

moduleFor('route:process', 'Unit | Route | process', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  setup: function() {
    runLaterStub = sinon.stub(Ember.run, 'later');
    runCancelStub = sinon.stub(Ember.run, 'cancel');
  },

  teardown: function() {
    runLaterStub.restore();
    runCancelStub.restore();
  }
});

test('it gets a process as its model', function(assert) {
  var route = this.subject();
  var dummyModel = obj();

  route.store = fakeStore().findsForTypeKey('porpoiseflow/process', dummyModel);

  route.model({id: 10})
  .then((model) => {
    assert.strictEqual(model, dummyModel);
    assert.ok(route.store.find.calledWith('porpoiseflow/process', 10));
  });
});

test('it schedules a refresh of the process after rendering',
  function(assert) {
    var route = this.subject();
    sinon.stub(route, '_super');
    sinon.stub(route, 'schedulePoll');

    route.render();

    assert.ok(route._super.called);
    assert.ok(route.schedulePoll.called,
      'render() should call schedulePoll if the process is incomplete');
  }
);

test('it skips the post-render refresh if the process is complete',
  function(assert) {
    var route = this.subject();
    sinon.stub(route, '_super');
    sinon.stub(route, 'schedulePoll');

    route.set('controller', obj({
      model: obj({
        isComplete: true
      })
    }));

    route.render();

    assert.ok(route._super.called);
    assert.ok(route.schedulePoll.notCalled,
      'render() should not call schedulePoll if the process is complete');
  }
);

test('it schedules data polling', function(assert) {
  var route = this.subject();
  sinon.stub(route, 'transitionOrHold');
  runLaterStub.returns('arbitrary return value');

  var model = obj({id: 1});
  model.reload = sinon.stub().returns(toPromiseProxy(model));

  route.set('controller', obj({ model: model }));
  route.schedulePoll();

  var runLaterArgs = runLaterStub.args[0];

  var callback = runLaterArgs[1];
  var modelArg = runLaterArgs[2];
  var timeout = runLaterArgs[3];

  assert.strictEqual(typeof(callback), 'function');
  assert.strictEqual(modelArg, route.get('controller.model'));
  assert.strictEqual(timeout, 1000);

  //make sure the callback actually does what we think it does:
  callback.bind(route)(route.get('controller.model'))
  .then(() => {
    assert.ok(
      route.transitionOrHold.calledWith(route.get('controller.model')),
      'the callback should call transitionOrHold');
  });
  }
);

test('it cancels a running poll', function(assert) {
  var route = this.subject();
  route.set('timer', 'arbitrary timer value');

  route.cancelPoll();

  assert.ok(runCancelStub.calledWith('arbitrary timer value'),
    'cancelPoll should call Ember.run.cancel');

});

test('it holds after polling if the process is complete',
  function(assert) {
    var route = this.subject();

    route.set('controller', obj({
      model: obj({
        isComplete: true
      })
    }));

    sinon.stub(route, 'handleProcessComplete');
    sinon.stub(route, 'continueProcess');

    route.transitionOrHold(route.get('controller.model'));
    assert.ok(route.handleProcessComplete.called);
    assert.ok(route.continueProcess.notCalled);
  }
);

test('it continues after polling if the process is incomplete',
  function(assert) {
    var route = this.subject();

    route.set('controller', obj({
      model: obj({
        isComplete: false
      })
    }));

    sinon.stub(route, 'handleProcessComplete');
    sinon.stub(route, 'continueProcess');

    route.transitionOrHold(route.get('controller.model'));
    assert.ok(route.handleProcessComplete.notCalled);
    assert.ok(route.continueProcess.called);
  }
);

test('it redirects to our parent process on completion (if we are a subprocess)',
  function(assert) {
    var route = this.subject();

    sinon.stub(route, 'replaceWith');

    var process = obj({
      subprocessOf: toPromiseProxy(obj({
        process: toPromiseProxy(obj({id: 10}))
      }))
    });

    route.handleProcessComplete(process)
    .then(() => {
      assert.ok(route.replaceWith.calledWith('process', 10));
    });
  }
);

test('it stays put after completion (if we\'re not a subprocess)',
  function(assert) {
    var route = this.subject();

    sinon.stub(route, 'replaceWith');

    var process = obj({
      subprocessOf: toPromiseProxy(null)
    });

    route.handleProcessComplete(process)
    .then(() => {
      assert.ok(route.replaceWith.notCalled);
    });
  }
);


test('it transitions to the next node if it finds one', function(assert) {
  var route = this.subject();

  sinon.stub(route, 'cancelPoll');
  sinon.stub(route, 'replaceWith');
  sinon.stub(route, 'schedulePoll');

  var node = obj({
    id: 20,
    subclass: 'TaskNode'
  });

  var user = obj();
  user.getNextNode = sinon.stub().returns(toPromiseProxy(node));

  var process = obj({
    owner: toPromiseProxy(user)
  });

  route.continueProcess(process)
  .then(() => {
    assert.ok(route.cancelPoll.called);
    assert.ok(route.replaceWith.calledWith('node', 20));

    assert.ok(route.schedulePoll.notCalled);
  });
});

test('it schedules another poll if it doesn\'t find a next node',
  function(assert) {
    var route = this.subject();

    sinon.stub(route, 'cancelPoll');
    sinon.stub(route, 'replaceWith');
    sinon.stub(route, 'schedulePoll').returns('dummy timer value');

    var user = obj();
    user.getNextNode = sinon.stub().returns(toPromiseProxy(null));

    var process = obj({
      owner: toPromiseProxy(user)
    });

    route.continueProcess(process)
    .then(() => {
      assert.ok(route.cancelPoll.notCalled);
      assert.ok(route.replaceWith.notCalled);

      assert.strictEqual(route.get('timer'), 'dummy timer value');
    });
  }
);
