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

  init: function() {
    this._super();

    //these have to be created in init -- otherwise we'll get the same spy for
    //every instance of the store
    this.find = sinon.spy(() => toPromiseProxy(this.get('findResult')));
    this.createRecord = sinon.spy((modelName, contents) =>
      Ember.Object.create(contents));
  },

  dataWasUpdated: function(type, internalModel) {
    //do nothing
  },

  //see init
  find: null,

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

  //see init
  createRecord: null,

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
