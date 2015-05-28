import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  extractErrors: function(store, type, payload, id) {
    if (payload && typeof payload === 'object') {

      //should typeKey be running through some kind of normalization hook here?
      payload = payload[type.typeKey];
      this.normalizeErrors(type, payload);
    }
    return payload;
  }
});
