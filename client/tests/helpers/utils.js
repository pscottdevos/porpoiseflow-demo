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

    sinon.spy(this, 'adapterFor');
    sinon.spy(this, 'createRecord');
    sinon.spy(this, 'dataWasUpdated');
    sinon.spy(this, 'find');
  },

  //=================== DS.Store API stubs ==================================

  //note that ``init`` wraps each of these in a spy
  
  adapterFor: function(modelName) {
    return this.get('fakeAdapter');
  },

  createRecord: function(modelName, contents) {
    return Ember.Object.create(contents);
  },

  dataWasUpdated: function(type, internalModel) {
    //do nothing
  },

  find: function() {
    return toPromiseProxy(this.get('findResult'));
  },

  //====================== FakeStore configuration methods ==================

  /**
   * Mocks the fake Store's find() method so that it always returns a
   * Promise resolving to result. If result is an Array, the Promise will be a
   * PromiseArray; otherwise, it'll be a PromiseObject.
   */
  alwaysFinds: function(result) {
    this.set('findResult', result);
    return this;
  },

  /**
   * Mocks the fake Store's adapterFor() method so that it always returns
   * fakeAdapter.
   */
  alwaysGetsAdapter: function(fakeAdapter) {
    this.set('fakeAdapter', fakeAdapter);
    return this;
  }

});

export var fakeStore = () => FakeStore.create();
export var emberObj = (plainObj) => Ember.Object.create(plainObj);
export { toPromiseProxy as toPromiseProxy };
