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

  assert.equal(invalidError.errors[0].detail, 'bar');
  assert.equal(invalidError.errors[0].source.pointer, 'data/attributes/foo');

  assert.equal(invalidError.errors[1].detail, 3);
  assert.equal(invalidError.errors[1].source.pointer, 'data/attributes/baz');
});

test('pathForType should create a flat, dasherized, plural path',
  function(assert) {
    var adapter = this.subject();
    assert.equal(adapter.pathForType('foo/barWidget'), 'bar-widgets');
});
