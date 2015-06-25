import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  processDef: DS.belongsTo('porpoiseflow/processDef', { async: true }),
  lane: DS.belongsTo('auth/group', { async: true }),

  subclass: DS.attr('string'),

  bpmn_id: DS.attr('string'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  joinMode: DS.attr('string'),
  splitMode: DS.attr('string'),
  isMultiInstance: DS.attr('boolean'),

  getOutgoingTransitions: function(){
    return this.store.find('porpoiseflow/transition', {input:this.get('id')});
  },

  /**
   * A PromiseObject comprising all node-def-properties for this node-def. The
   * names of the properties are mapped to their model instances, e.g.,
   * `this.get('nodeDefProperties.widgetType.value') === 'button'`.
   *
   * Note that property names are in camelCased form. To get the original
   * (underscored) name, refer to the instance:
   * `this.get('nodeDefProperties.widgetType.name') === 'widget_type'`
   * @return {DS.PromiseObject}
   */
  nodeDefProperties: function() {
    var promise = this.store.find('porpoiseflow/node-def-property', {
      node_def: this.get('id')
    })
    .then((properties) => {
      var propertyMapping = Ember.Object.create();

      properties.forEach((property) =>
        propertyMapping.set(property.get('name').camelize(), property));

      return propertyMapping;
    });

    return DS.PromiseObject.create({promise: promise});
  }.property('id'),
});
