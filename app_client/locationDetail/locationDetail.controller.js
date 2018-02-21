(function () {
    angular
        .module('loc8rApp')
        .controller('locationDetailCtrl', ['$routeParams', '$uibModal', 'loc8rData',
            function locationDetailCtrl($routeParams, $uibModal, loc8rData) {
                var vm = this;
                vm.locationid = $routeParams.locationid;
                loc8rData.getLocationById(vm.locationid)
                    .then(function (data) {
                            console.dir(data.data);
                            vm.data = {
                                location: data.data
                            };
                            vm.pageHeader = {
                                title: vm.data.location.name
                            };
                        },
                        function (e) {
                            console.log(e);
                        });
                vm.popupReviewForm = function () {
                    alert("yes");
                    var modalInstance = $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'reviewModal/reviewModal.view.html',
                        controller: 'reviewModalCtrl',
                        controllerAs: 'vm',
                        size: 'lg',
                        resolve: {

                        }
                    });
                };
            }
        ]);



})();