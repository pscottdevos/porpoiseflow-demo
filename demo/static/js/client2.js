$(function() {

  $.extend(client, {

    addToListUi: function(nodes) {
      var self = this;
      $('#info').html('<ol></ol>');
      list = $('#info ol');
      for (i in nodes) {
        node = nodes[i];
        $.get('/api/node-defs/' + node.node_def)
        .done(function(nodeDef) {
          li = list.append('<li><span id=node' + node.id + '>' + nodeDef.name + '</span></li>');
          span = $('#node' + node.id);
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
          data: node
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
