import Ember from 'ember';
import DS from 'ember-data';

import sinon from 'sinon';

var FakeStore = Ember.Object.extend({
  find: sinon.spy(function() {
    var result = this.get('findResult');
    var promise = Ember.RSVP.resolve(result);

    if (Ember.isArray(result)) {
      return DS.PromiseArray.create({promise: promise});
    }

    return DS.PromiseObject.create({promise: promise});
  }),

  /**
   * Mocks the fake Store's find() function so that it always returns a
   * Promise resolving to result. If result is an Array, the Promise will be a
   * PromiseArray; otherwise, it'll be a PromiseObject.
   */
  alwaysFinds: function(result) {
    this.set('findResult', result);
    return this;
  },

  findCalled: function() {
    return this.find.called;
  },

  findCalledWith: function() {
    return this.find.calledWith(arguments);
  }
});

export var fakeStore = () => FakeStore.create();
export var emberObj = (plainObj) => Ember.Object.create(plainObj);
