import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('porpoiseflow/processDef');
//    return [
//      {
//        enabled: true,
//        date: '5/26/2015',
//        name: 'Demo ProcessDef',
//        process_id: 1,
//        process_type: 'demo',
//        description: 'A demo process def',
//        superceded_by: null
//      },
//      {
//        enabled: true,
//        date: '5/24/2015',
//        name: 'Demo ProcessDef 2',
//        process_id: 2,
//        process_type: 'demo',
//        description: 'A second demo process def',
//        superceded_by: null
//      }
//    ];
  }
});
