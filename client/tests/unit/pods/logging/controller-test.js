import { moduleFor, test } from 'ember-qunit';

import { emberObj as obj } from 'client/tests/helpers/utils';

moduleFor('controller:logging', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

// Replace this with your real tests.
test('it shows or hides the text box based on widget type', function(assert) {
  var controller = this.subject();
  
  controller.set('model', obj({widgetType: 'none'}));
  assert.strictEqual(controller.get('showTextBox'), false);

  controller.set('model.widgetType', 'text');
  assert.strictEqual(controller.get('showTextBox'), true);
});
