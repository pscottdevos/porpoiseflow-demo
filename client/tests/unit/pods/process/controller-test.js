import { moduleFor, test } from 'ember-qunit';
import { emberObj as obj, toPromiseProxy } from 'client/tests/helpers/utils';

import sinon from 'sinon';

moduleFor('controller:process', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it always returns false for hasWaitingTask if the process is complete',
  function(assert) {
    var controller = this.subject();
    controller.set('model', obj({statusName: 'complete'}));

    assert.strictEqual(controller.get('isComplete'), true);
    assert.strictEqual(controller.get('hasWaitingTask'), false);

  }
);

test('it knows whether we have a waiting task on this process',
  function(assert) {
    var controller = this.subject();

    var node = obj({subclass: 'TaskNode'}); //this is our "waiting task"

    var owner = obj({ //this is "us"
      getNextNode: sinon.stub().returns(toPromiseProxy(node))
    });

    var process = obj({ owner: toPromiseProxy(owner) });
    controller.set('model', process);

    var done = assert.async();

    controller.addObserver('hasWaitingTask', this, () => {
      assert.strictEqual(controller.get('hasWaitingTask'), true);
      done();
    });
  }
);
