$(function() {

  $.extend(client, {

    doProcess: function() {
      var self = this;
      $.get( "/api/nodes", {next_for_actor:client.userId})
      .done(function(nodes) {
        if (nodes.length) {
          self.doNode(nodes[0])
        } else {
          self.setUi({
            callback: self.start, 
            task: {},
            info: 'End of process',
            prmpt: '<p>Submit to start again.</p>',
            original: '',
            showInput: false
          });
        }
      });
    },

  });

  client.start();

});
