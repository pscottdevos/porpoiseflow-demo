$(function() {

  $.extend(client, {

    doProcess: function() {
      var self = this;
      $.get( "/api/nodes", {next_for_actor:client.userId})
      .done(function(nodes) {
        if (nodes.length) {
          self.doNode(nodes[0])
        } else {
          $.get(
            '/api/nodes',
            {available_for_actor:self.userId, process:self.process.id}
          )
          .done(function(nodes) {
            if (nodes.length) {
              self.assignNode(nodes[0])
            } else {
              $.get('/api/processes/' + self.process.id)
              .done(function(process) {
                self.process = process
                $.get('/api/process-statuses/' + self.process.status)
                .done(function(status) {
                  if (status.name === 'complete') {
                    prmpt = '<p>Submit to start again.</p>';
                  } else {
                    prmpt = '<p>Nothing to do at this time. ' +
                            'Submit to check again.</p>';
                  }
                  self.setUi({
                    callback: self.start, 
                    task: {},
                    info: 'End of process',
                    prmpt: prmpt,
                    original: '',
                    showInput: false
                  });
                });
              });
            }
          })
        }
      });
    },

  });

  client.start();

});
