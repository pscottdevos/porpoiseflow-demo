import DS from 'ember-data';

export default DS.Model.extend({
  processDef: DS.belongsTo('porpoiseflow/processDef', { async: true }),
  status: DS.belongsTo('porpoiseflow/processStatus', { async: true }),
  statusHistory: DS.hasMany('porpoiseflow/processStatus', {
    async: true,
    inverse: 'process' }),
  subprocessOf: DS.belongsTo('porpoiseflow/subprocess', { async: true }),

  owner: DS.attr('number'),
  createdOn: DS.attr('date')
});
