import Ember from 'ember';

import config from 'client/config/environment';

export default Ember.Controller.extend({
  useAnimations: config.APP.USE_ANIMATIONS
});
