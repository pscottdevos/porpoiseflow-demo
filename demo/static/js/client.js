String.prototype.patherize = function() {
    return '/api/' + this.underscore().pluralize().dasherize();
};

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


  doNode: function(node) {
    var self = this;
    this.recast(node)
    .done(function(node) {
      if (node.subclass === 'Gateway') {
        self.setUi({
          callback: self.doProcess, 
          task: {},
          info: node_def.name,
          prmpt: 'Submit to continue',
          original: '',
          showInput: false
        });

      } else if (node.subclass === 'TaskNode') {
        self.doTaskNode(node);
      }
    })
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
      input.focus();
    } else {
      input.hide();
    }
    button = $('#button')
    button.off();
    if (params.callback) {
      button.click(params.callback.bind(this, params.task));
      button.show();
    } else {
      button.hide();
    }
  },

  save: function(path, data) {
    if (data.id === undefined) {
      return $.post(path, data);
    } else {
      return $.ajax({ type: "PUT", url: path + '/' + data.id, data: data });
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
          .done(self.doProcess.bind(self));
        } else {
          self.doProcess();
        }
      })
    });
  }

});
