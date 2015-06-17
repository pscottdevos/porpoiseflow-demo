import { moduleForComponent, test } from 'ember-qunit';

import Ember from 'ember';
import DS from 'ember-data';

import { fakeStore, emberObj as obj } from 'client/tests/helpers/utils';

moduleForComponent('process-link', 'Unit | Component | process link', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it finds the process, if any, associated with processDef',
  function(assert) {
    // Creates the component instance
    var component = this.subject();

    var process = obj({
      id: 0
    });
    var store = fakeStore().alwaysFinds([process]);

    var done = assert.async();

    component.set('processDef', obj({
      id: 0,
      store: store
    }));
    component.set('user', obj({
      id: 0
    }));

    component.get('process')

    .then(function() {
      assert.ok(store.find.called);
      assert.strictEqual(component.get('process.id'), process.get('id'));
      done();
    });
});
