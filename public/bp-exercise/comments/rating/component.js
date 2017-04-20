function RatingController($scope, CommentsService) {
  let tmpValue = null;
  
  const vm = this;
  const socket = bpExerciseApp.socket;
  const UPDATE_RATING_EVENT = 'update-component-rating';
  
  const eventCallback = (data) => {
    if (data.commentId === vm.commentId) {
      // https://github.com/angular/angular.js/wiki/When-to-use-$scope.$apply()
      $scope.$apply(function () {
        vm.value = data.newRating;
        vm.ratingOwner = 'ext';
      });
    }
  };
  
  vm.SetRating = (newValue) => {
    vm.isLoading = true;
    CommentsService.SetRating(vm.commentId, newValue).then(() => {
      tmpValue = null;
      vm.value = newValue;
      vm.ratingOwner = 'me';
      vm.isLoading = false;
      
      const eventData = {commentId: vm.commentId, newRating: newValue};
      socket.emit(UPDATE_RATING_EVENT, eventData);
      
    });
  };
  
  vm.setTempValue = (rating) => {
    tmpValue = vm.value || 0;
    vm.value = rating;
    vm.isMove = true;
  };
  
  vm.returnOriginValue = () => {
    if (tmpValue !== null) {
      vm.value = tmpValue;
    }
    tmpValue = null;
    vm.isMove = false;
  };
  
  vm.$onInit = function () {
    vm.ratingOwner = 'avg';
    vm.getRange = () => [1, 2, 3, 4, 5];
    
    socket.on(UPDATE_RATING_EVENT, eventCallback);
  };
  
  vm.$onDestroy = function () {
    socket.removeListener(UPDATE_RATING_EVENT, eventCallback);
  };
  
}

RatingController.$inject = ['$scope', 'CommentsService'];

bpExerciseApp.component('commentsRating', {
  controller: RatingController,
  templateUrl: 'bp-exercise/comments/rating/rating.html',
  bindings: {
    commentId: '<',
    value: '='
  }
});
