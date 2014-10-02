// Publish all invites

Meteor.publish('allVotingInvites', function(filterBy, sortBy, limit) {
  if(isAdminById(this.userId)){
    return VotingInvites.find();
  }
  return [];
});


Meteor.publish('voteInvitation', function(id) {
  return VotingInvites.find({_id: id});
});
