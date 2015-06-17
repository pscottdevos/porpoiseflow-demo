import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

import { toPromiseProxy, emberObj as obj } from 'client/tests/helpers/utils';

var ajaxStub;

moduleFor('adapter:porpoiseflow/node', 'Unit | Adapter | porpoiseflow/node', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
  setup: function() {
    ajaxStub = sinon.stub(Ember.$, 'ajax', function() {
      var fakeJqXHR = {};
      fakeJqXHR.done = function(callback) {
        this.doneCallback = callback;
        return this;
      };

      fakeJqXHR.fail = function(callback) {
        this.failCallback = callback;
        return this;
      };

      return fakeJqXHR;
    });
  },

  teardown: function() {
    ajaxStub.restore();
  }
});

// Replace this with your real tests.
test('sends an AJAX request to assign a task node', function(assert) {
  var adapter = this.subject();

  var node = obj({
    id: 42,
    subclass: 'TaskNode',
    namespace: 'porpoiseflow/'
  });

  var store = obj({
    push: sinon.stub().returns(node)
  });

  var actor = obj({
    id: 1
  });

  var done = assert.async();

  adapter.assign(node, store, actor)
  .then((finalNode) => {
    assert.strictEqual(node, finalNode);
    done();
  });

  assert.strictEqual(ajaxStub.args[0][0].url, 'api/task-nodes/42');
  assert.strictEqual(ajaxStub.args[0][0].type, 'PATCH');
  assert.strictEqual(ajaxStub.args[0][0].data,
    '{"porpoiseflow/taskNode":{"actor":1}}');


  //cause the fake server to "respond" with the appropriate data
  //(thus resolving the promise and finishing the test)
  ajaxStub.returnValues[0].doneCallback({
    'porpoiseflow/taskNode': {
      id: 42,
      subclass: 'TaskNode'
    }
  }, "", {});
});
