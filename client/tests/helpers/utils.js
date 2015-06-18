import Ember from 'ember';
import DS from 'ember-data';

var toPromiseProxy = function(content) {
  var promise = Ember.RSVP.resolve(content);

    if (Ember.isArray(content)) {
      return DS.PromiseArray.create({promise: promise});
    }

    return DS.PromiseObject.create({promise: promise});
};

export var emberObj = (plainObj) => Ember.Object.create(plainObj);
export { toPromiseProxy as toPromiseProxy };
