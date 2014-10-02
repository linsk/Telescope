var csv = Meteor.npmRequire('csv');
var csv_parse = Meteor.wrapAsync(csv.parse);

Meteor.methods({
  uploadInvitationsCsv: function (data) {
    if (!isAdmin(Meteor.user()))
      throw new Meteor.Error(403, "Not an admin");

    var parsed;

    parsed = csv_parse(data, {columns: true});

    parsed.forEach(function(row) {
      var id;

      row.invitedUserEmail = row.email;
      delete row['email'];

      row.voteWeight = row.amount;
      delete row['amount'];

      VotingInvites.upsert({invitedUserEmail: row.invitedUserEmail}, {$set: row})
    });
  }
});
