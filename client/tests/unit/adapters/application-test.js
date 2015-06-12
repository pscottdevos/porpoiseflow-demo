import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:application', 'Unit | Adapter | application', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

test('ajaxError should detect a validation error response', function(assert) {
  var adapter = this.subject();

  var errorJqxhr = {
    status: 400,
    responseText: JSON.stringify({
      foo: 'bar',
      baz: 3
    })
  };

  var invalidError = adapter.ajaxError(errorJqxhr);

  assert.equal(invalidError.errors.foo, 'bar');
  assert.equal(invalidError.errors.baz, 3);
});

test('pathForType should create a flat, dasherized, plural path',
  function(assert) {
    var adapter = this.subject();
    assert.equal(adapter.pathForType('foo/barWidget'), 'bar-widgets');
});
