VotingInviteSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  invitedUserEmail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  voteWeight: {
    type: Number
  },
  accepted: {
    type: Boolean,
    optional: true
  },
});

VotingInvites = new Meteor.Collection("votingInvites");
VotingInvites.attachSchema(VotingInviteSchema);


// invites are managed through Meteor method

VotingInvites.deny({
  insert: function(){ return true; },
  update: function(){ return true; },
  remove: function(){ return true; }
});
