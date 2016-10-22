function TestCtrl() {
  this.message = "hello world";
};

angular
  .module('app')
  .controller('TestCtrl', TestCtrl);
