  $.extend(client, {

    startLogging: function(node_def, node, task) {
      this.setUi({
        callback: this.endLogging, 
        task: task,
        info: node_def.name,
        prmpt: 'Enter text to log',
        original: '',
        showInput: true
      });
    },

    endLogging: function(task) {
      var self = this
      $.extend(task, {text:$('#input').val()});
      this.save('/api/loggings', task)
      .done(self.doProcess.bind(self));
    },

    startChoice: function(node_def, node, task) {
      this.setUi({
        callback: this.endChoice, 
        task: task,
        info: node_def.name,
        prmpt: 'Enter transitions to follow',
        original: '',
        showInput: true
      });
    },

    endChoice: function(task) {
      var self = this;
      $.extend(task, {choices:$('#input').val()})
      this.save('/api/choices', task)
      .done(self.doProcess.bind(self));
    },

    doTaskNode: function(node) {
      var self = this;
      $.get(node.task_class.patherize(), {'task_node':node.id})
      .done(function(tasks) {
        if (tasks.length) {
          task = tasks[0];
        } else {
          task = {task_node:node.id};
        }
        $.get('/api/node-defs/' + node.node_def)
        .done(function(node_def) {
          self['start' + node.task_class](node_def, node, task);
        });
      });
    },

    getTask: function(node) {
      $.get(node.task_class.patherize(), {'task_node':node.id})
      .done(function(task) {
        if (task.length) {
          return task[0];
        } else {
          return {'task_node':node.id};
        }
      });
    },

    recast: function(node) {
      return $.get(node.subclass.patherize() + '/' + node.id);
    },

    setUi: function(params) {
      $('#prompt').text(params.prmpt);
      $('#info').text(params.info + ":");
      input = $('#input')
      input.val(params.original);
      if (params.showInput) {
        input.show();
      } else {
        input.hide();
      }
      button = $('#button')
      button.off();
      button.click(params.callback.bind(this, params.task));
    },

    save: function(path, data) {
      if (data.id === undefined) {
        return $.post(path, data);
      } else {
        return $.put(path + '/' + data.id, data);
      }
    },

    start: function() {
      var self = this;
      $.get( "/api/process-defs", { process_id: this.processId })
      .done(function(processDefs) {
        $.get( "/api/processes", {
          owner: self.userId,
          process_def: processDefs[0].id,
          status__name: "active"
        })
        .done(function(processes) {
          if (!processes.length) {
            $.post( "/api/processes", { owner: self.userId, process_def: processDefs[0].id })
            .done(function() {self.doProcess();});
          } else {
            self.doProcess();
          }
        })
      });
    }

  });
