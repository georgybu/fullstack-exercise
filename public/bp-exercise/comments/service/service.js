bpExerciseApp.service('CommentsService', function($http) {
  this.List = () => {
    return $http.get('/comments').then((results) => results.data);
  };
  
  this.SetRating = (commentId, newRating) => {
    return $http.post('/ratings', {commentId, newRating});
  };
});
