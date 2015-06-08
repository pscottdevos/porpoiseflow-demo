var taskRoutes = ['logging', 'choice'];
var standardArgs = {
  duration: 1000
};

export default function() {
  this.transition(
    this.toRoute('process-defs'),
    this.use('toDown', standardArgs));

  this.transition(
    this.fromRoute('process-defs'),
    this.use('toUp', standardArgs));

  this.transition(
    this.fromRoute(taskRoutes),
    this.toRoute(['node', 'process']),
    this.use('toLeft', standardArgs));

  this.transition(
    this.fromRoute(['node', 'process']),
    this.toRoute(taskRoutes),
    this.use('toLeft', standardArgs));

}
