Template[getTemplate('postUpvote')].helpers({
  upvoted: function(){
    var user = Meteor.user();
    if(!user) return false;
    return _.include(this.upvoters, user._id);
  },
  oneBasedRank: function(){
    if(typeof this.rank !== 'undefined')
      return this.rank + 1;
  }
});

Template[getTemplate('postUpvote')].events({
  'click .upvote': function(e, instance){
    var post = this;
    e.preventDefault();
    if(!Meteor.user()){
      Router.go(getSigninUrl());
      throwError(i18n.t("Please log in first"));
    }

    if (_.include(this.upvoters, Meteor.user()._id)) {
      Meteor.call('cancelUpvotePost', post, function(error, result){
        trackEvent("post cancelled upvote", {'_id': post._id});
      });
    } else {
      Meteor.call('upvotePost', post, function(error, result){
        trackEvent("post upvoted", {'_id': post._id});
      });
    }
  }
});
