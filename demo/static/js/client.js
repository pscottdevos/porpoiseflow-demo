String.prototype.patherize = function() {
    return '/api/' + this.underscore().pluralize().dasherize();
};

$.extend(client, {

  startLogging: function(node_def, node, task) {
    var prmpt = '<p>Please enter text to log.</p>';
    var self = this;
    this.getNodeDefProperty(node_def, 'prompt')
    .done( function(promptProperties) {
      if (promptProperties.length > 0) {
        prmpt = promptProperties[0].value
      }
      self.setUi({
        callback: self.endLogging, 
        task: task,
        info: node_def.name,
        prmpt: prmpt,
        original: '',
        showInput: true
      });
    });
  },

  endLogging: function(task) {
    var self = this
    $.extend(task, {text:$('#input').val()});
    this.save('/api/loggings', task)
    .done(self.doProcess.bind(self));
  },

  startChoice: function(node_def, node, task) {
    var prmpt = 'Enter transitions to follow';
    var self = this;
    this.getNodeDefProperty(node_def, 'prompt')
    .done( function(promptProperties) {
      if (promptProperties.length > 0) {
        prmpt = promptProperties[0].value
      }
      self.setUi({
        callback: self.endChoice, 
        task: task,
        info: node_def.name,
        prmpt: prmpt,
        original: '',
        showInput: true
      });
    });
  },

  endChoice: function(task) {
    var self = this;
    $.extend(task, {choices:$('#input').val()})
    this.save('/api/choices', task)
    .done(self.doProcess.bind(self));
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

  doNode: function(node) {
    var self = this;
    this.recast(node)
    .done(function(node) {
      self.getNodeDef(node)
      .done(function (node_def) {
        if (node.subclass === 'ParallelGateway' || 
            node.subclass === 'ExclusiveGateway' ||
            node.subclass === 'InclusiveGateway') {
          self.setUi({
            callback: self.doProcess,
            task: {},
            info: node_def.name || node_def.bpmn_id,
            prmpt: 'Submit to continue',
            original: '',
            showInput: false
          });

        } else if (node.subclass === 'TaskNode') {
          self.doTaskNode(node_def, node);
        }
      })
    })
  },

  doTaskNode: function(node_def, node) {
    var self = this;
    $.get(node.task_class.patherize(), {'task_node':node.id})
    .done(function(tasks) {
      if (tasks.length) {
        task = tasks[0];
      } else {
        task = {task_node:node.id};
      }
      self['start' + node.task_class](node_def, node, task);
    });
  },

  getNodeDef: function(node) {
    return $.get('/api/node-defs/' + node.node_def);
  },

  getNodeDefProperty: function(nodeDef, name) {
    return $.get('/api/node-def-properties', {
      'node_def': nodeDef.id,
      'name': name})
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
    $('#workflow').text(this.processId.humanize());
    $('#info').text(params.info);
    $('#prompt').html(params.prmpt);
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
    $.get( "/api/process-defs", { process_id: self.processId })
    .done(function(processDefs) {
      if (processDefs.length) {
        self.startProcess(self.userId, processDefs[0]);
      } else {
        self.setUi({

          callback: null,
          task: {},
          info: self.processId.humanize() + ' not found',
          prmpt: '',
          original: '',
          showInput: false
        });
      }
    });
  },

  startProcess: function(owner, processDef) {
    var self = this;
    self.process = null;

    $.get( "/api/processes", {
      owner: self.userId,
      process_def: processDef.id,
      status__name: "active"
    })
    .done(function(processes) {
      if (processes.length) {
        self.process = processes[0];
        self.doProcess();
      } else {
        $.post( "/api/processes", { owner: self.userId, process_def: processDef.id })
        .done(function (process) {
          if (process.process_def === processDef.id) {
            self.process = process;
            self.doProcess();
          } else {
            self.setUi({
              callback: null,
              task: {},
              info: self.processId.humanize() + ' not found for user.',
              prmpt: '',
              original: '',
              showInput: false
            });
          }
        });
      }
    })
  }

});
