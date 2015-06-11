import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

moduleFor('serializer:application', 'Unit | Serializer | application', {
  // Specify the other units that are required for this test.
  needs: ['model:auth/user', 'model:auth/group']
});

// Replace this with your real tests.
test('it extracts errors', function(assert) {
  //errors are stored directly underneath the type key in our JSON
  
  var serializer = this.subject();
  var spy = sinon.spy();

  serializer.normalizeErrors = spy;
  
  var errorPayload = {
    'some-model': {
      'someField': ['This value is invalid']
    }
  };

  var type = {typeKey: 'some-model'};

  var extracted = serializer.extractErrors(
    null, //store
    type,
    errorPayload,
    null); //id

  assert.ok(spy.calledWith(type, extracted),
    'extractErrors should call normalizeErrors');
  assert.equal(extracted, errorPayload['some-model']);
});
