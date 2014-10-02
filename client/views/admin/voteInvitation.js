Template[getTemplate('voteInvitation')].helpers({
  isUserInvited: function () {
    return Meteor.user().isInvited;
  }
});

Template[getTemplate('voteInvitation')].events({
  "click #acceptInvitation": function(event) {
    Meteor.call('acceptInvitation', this._id, function (err) {
      if (err) {
        throwError(err.reason);
      }
    });
  }
});
