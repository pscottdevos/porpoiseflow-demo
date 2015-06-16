import Ember from 'ember';
import DS from 'ember-data';

import sinon from 'sinon';

var toPromiseProxy = function(content) {
  var promise = Ember.RSVP.resolve(content);

    if (Ember.isArray(content)) {
      return DS.PromiseArray.create({promise: promise});
    }

    return DS.PromiseObject.create({promise: promise});
};

var FakeStore = Ember.Object.extend({

  find: sinon.spy(function() {
    var result = this.get('findResult');
    return toPromiseProxy(result);
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
    return this.find.calledWith.apply(this.find, arguments);
  },


  createRecord: sinon.spy(function(modelName, contents) {
    return Ember.Object.create(contents);
  }),

  createRecordCalled: function() {
    return this.createRecord.called;
  },

  createRecordCalledWith: function() {
    return this.createRecord.calledWith.apply(this.createRecord, arguments);
  }
});

export var fakeStore = () => FakeStore.create();
export var emberObj = (plainObj) => Ember.Object.create(plainObj);
export { toPromiseProxy as toPromiseProxy };
