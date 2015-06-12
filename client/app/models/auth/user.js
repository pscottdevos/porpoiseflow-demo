import DS from 'ember-data';

export default DS.Model.extend({
  username: DS.attr('string'),
  email: DS.attr('string'),
  groups: DS.hasMany('auth/group', { async: true}),

  getNextNode: function (process) {
    return this.store.find('porpoiseflow/node',
      {next_for_actor: this.get('id'), process: process.get('id')}
    )
    .then((nodes) => {
      if (nodes.get('length')) {
        return nodes.objectAt(0);
      } else {
        return this.store.find('porpoiseflow/node',
          {available_for_actor: this.get('id'), process: process.get('id')}
        )
        .then((nodes) =>
        {
          if (nodes.get('length')) {
            var node = nodes.objectAt(0);
            return node.assign(this);
          } else {
            return null;
          }
        });
      }
    });
  }
});
