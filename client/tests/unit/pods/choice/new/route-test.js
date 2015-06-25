import { moduleFor, test } from 'ember-qunit';
import { toPromiseProxy, emberObj as obj } from 'client/tests/helpers/utils';

moduleFor('route:choice/new', 'Unit | Route | choice/new', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it adds the widget type to its created model', function(assert) {
  var route = this.subject();

  var propObject = obj({
    'widgetType': obj({
      name: 'widget_type',
      value: 'button'
    })
  });

  var model = obj();

  assert.strictEqual(model.get('widgetType'), undefined);

  route.setNodeDefProperties(model, propObject);
  assert.strictEqual(model.get('widgetType'), 'button');
});
