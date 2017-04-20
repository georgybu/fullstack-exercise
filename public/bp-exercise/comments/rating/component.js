function RatingController($scope, CommentsService) {
  const vm = this;
  const UPDATE_RATING_EVENT = 'update-component-rating';
  let tmpValue = null;
  
  vm.ratingOwner = 'avg';
  vm.getRange = () => [1, 2, 3, 4, 5];
  
  vm.SetRating = (newValue) => {
    vm.isLoading = true;
    CommentsService.SetRating(vm.commentId, newValue).then(() => {
      tmpValue = null;
      vm.value = newValue;
      vm.ratingOwner = 'me';
      vm.isLoading = false;
      bpExerciseApp.socket.emit(UPDATE_RATING_EVENT, {
        commentId: vm.commentId,
        newRating: newValue
      });
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
  
  bpExerciseApp.socket.on(UPDATE_RATING_EVENT, function (data) {
    if (data.commentId === vm.commentId) {
      // https://github.com/angular/angular.js/wiki/When-to-use-$scope.$apply()
      $scope.$apply(function () {
        vm.value = data.newRating;
        vm.ratingOwner = 'ext';
      });
    }
  });
  
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
