(function () {
    angular
        .module('loc8rApp')
        .controller('reviewModalCtrl', reviewModalCtrl);
    reviewModalCtrl.$inject = ['$uibModalInstance'];

    function reviewModalCtrl($uibModalInstance) {
        var vm = this;
        vm.close = function () {
            $uibModalInstance.dismiss('cancel');
         };
    }
})();