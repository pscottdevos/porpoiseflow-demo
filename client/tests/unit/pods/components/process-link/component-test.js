import { moduleForComponent, test } from 'ember-qunit';

import Ember from 'ember';
import DS from 'ember-data';

import sinon from 'sinon';

moduleForComponent('process-link', 'Unit | Component | process link', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it finds the process, if any, associated with processDef',
  function(assert) {
    // Creates the component instance
    var component = this.subject();

    var process = Ember.Object.create({
      id: 0
    });

    var findStub = sinon.stub().returns(DS.PromiseArray.create({
      promise: Ember.RSVP.resolve([process])
    }));

    var processDef = Ember.Object.create({
      'id': 0,
      store: {
        find: findStub
      }
    });

    var user = Ember.Object.create({
      'id': 0
    });

    var done = assert.async();

    component.set('processDef', processDef);
    component.set('user', user);

    component.get('process')

    .then(function() {
      assert.strictEqual(component.get('process.id'), process.get('id'));
      done();
    });

  });
