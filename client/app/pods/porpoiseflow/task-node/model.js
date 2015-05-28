import DS from 'ember-data';
import Node from './node';

export default Node.extend({
  taskClass: DS.attr('string'),
});
