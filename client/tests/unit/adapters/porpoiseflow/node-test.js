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
      return {
        done: function(callback) {
          this.doneCallback = callback;
          return this;
        },
        fail: function(callback) {
          this.failCallback = callback;
          return this;
        }
      };
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

  adapter.assign(node, store, actor)
  .then((finalNode) => {
    assert.strictEqual(node, finalNode);
  });

  //the first argument to the first call of ajaxStub
  //(see sinon docs for sinon.spy)
  var optionsToAjax = ajaxStub.args[0][0];

  assert.strictEqual(optionsToAjax.url, 'api/task-nodes/42');
  assert.strictEqual(optionsToAjax.type, 'PATCH');
  assert.strictEqual(optionsToAjax.data,
    '{"porpoiseflow/taskNode":{"actor":1}}');


  //the result of assign() calling ajaxStub (our fake jqXHR object from setup())
  var fakeJqXHR = ajaxStub.returnValues[0];

  //cause the fake server to "respond" with the appropriate data
  //(thus resolving the promise and finishing the test)
  fakeJqXHR.doneCallback({
    'porpoiseflow/taskNode': {
      id: 42,
      subclass: 'TaskNode'
    }
  }, "", {});
});
