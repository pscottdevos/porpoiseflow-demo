$(function() {

  $.extend(client, {

    addToListUi: function(nodes) {
      var self = this;
      $('#info').html('Available Tasks');
      if (nodes.length) {
        var prompt_end = 'Please select a task.';
      } else {
        var prompt_end = 'There are no tasks available for you.';
      }
      var prmpt = $('#prompt').html('<ol></ol>\n<p>' + prompt_end + '</p>');
      var list = $('#prompt ol');
      for (i in nodes) {
        var node = nodes[i];
        $.get('/api/node-defs/' + node.node_def)
        .done(function(nodeDef) {
          li = list.append('<li><span id=node' + node.id + '>' + nodeDef.name + '</span></li>');
          var span = $('#node' + node.id);
          span.off();
          span.click(self.assignNode.bind(self, node));
          span.css('cursor', 'pointer');
        });
      }
    },

    assignNode: function(node) {
      var self = this;
      this.recast(node)
      .done(function (node) {
        $.ajax({
          type: "PATCH",
          url: node.subclass.patherize() + '/' + node.id,
          data: {actor:client.userId}
        })
        .done(function () { self.doNode(node); })
      });
    }, 

    doProcess: function() {
      var self = this;
      this.prepListUi();
      $.get( "/api/nodes", {next_for_actor:client.userId})
      .done(function(nodes) {
        if (nodes.length) {
          self.assignNode(node[0]);
        } else {
          $.get('/api/nodes', {'available_for_actor':client.userId})
          .done(self.addToListUi.bind(self));
        }
      });
    },

    prepListUi: function() {
      this.setUi({
        callback: null, 
        task: {},
        info: '',
        prmpt: 'Select a task from the list above',
        original: '',
        showInput: false
      })
    },

  });

  client.start();

});
