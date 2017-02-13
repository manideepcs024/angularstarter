(function (module) {
  'use strict';
    // var testController;
  testController.$inject = ['$http', '$state'];

  function testController ($http, $state) {
    var vm = this;
    vm.desc = 'Just an Basic Angular app Structure to start an Project !!!!!!! ';
  }
  module.controller('testController', testController);
})(angular.module('Cmm.Controllers'));
