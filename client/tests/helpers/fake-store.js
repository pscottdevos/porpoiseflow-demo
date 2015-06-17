import Ember from 'ember';
import sinon from 'sinon';

import { toPromiseProxy } from './utils';

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

  //refer to alwaysFinds, alwaysFindsFrom, and findsForTypeKey for explanation
  //of find() behavior
  find: function(typeKey, id, options) {
    if (this.get('alwaysFindResult') !== undefined) {
      return toPromiseProxy(this.get('alwaysFindResult'));
    }

    var result = this.get('findResults')[typeKey];

    if (typeof(id) === 'object') {
      //this is actually a query -- we don't have an ID
      options = id;
      id = undefined;
    }

    if (typeof(result) === 'function') {
      result = result(id, options);
    }

    return toPromiseProxy(result);
  },

  //====================== FakeStore configuration methods ==================

  //we use undefined because null might be a valid result for the store to find
  alwaysFindResult: undefined,

  findResults: {
    // typeKey: { }, //(always gets this for typeKey)
    // otherTypeKey: function(id, options) { ... } //gets result given id/options
  },

  /**
   * Mock the fake Store's find() method so that it always returns a
   * Promise resolving to result. If result is an Array, the Promise will be a
   * PromiseArray; otherwise, it'll be a PromiseObject.
   *
   * **Overrides** any previous calls to alwaysFinds, alwaysFindsFrom, or
   * findsForTypeKey.
   */
  alwaysFinds: function(result) {
    this.set('findResults', {});
    this.set('alwaysFindResult', result);
    return this;
  },

  /**
   * Mock the store so that find() returns different values depending on the
   * typeKey and (potentially) the id/options arguments. This **overwrites** any
   * previous calls to alwaysFindsFrom, alwaysFinds, or findsForTypeKey.
   *
   * The only argument is an object that maps type keys to either:
   *
   * * An object or array (which will always be found for that type key), or
   * * A function taking `(id, options)`, which returns the object or array to
   *   be found for that type key, given the `id` and `options` arguments.
   *
   * For instance:
   *
   * ```javascript
   * fakeStore.alwaysFindsFrom({
   *   someModel: Ember.Object.create({id: 42}),
   *   otherModel: (id, options) = Ember.Object.create({id: id})
   * })
   * ```
   * 
   * @param  {Object} findResultsHash
   */
  alwaysFindsFrom: function(findResultsHash) {
    this.set('alwaysFindResult', undefined);
    this.set('findResults', findResultsHash);

    return this;
  },

  /**
   * Mock find() behavior for one type key. Result can be either an object,
   * array, or a function (see alwaysFindsFrom for details).
   */
  findsForTypeKey: function(typeKey, result) {
    this.get('findResults')[typeKey] = result;
  },

  /**
   * Mock the fake Store's adapterFor() method so that it always returns
   * fakeAdapter.
   */
  alwaysGetsAdapter: function(fakeAdapter) {
    this.set('fakeAdapter', fakeAdapter);
    return this;
  },

});

export default () => FakeStore.create();
