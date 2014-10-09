var csv = Meteor.npmRequire('csv');
var csv_parse = Meteor.wrapAsync(csv.parse);

var emailTemplates = Meteor.npmRequire('email-templates');
var path = Npm.require("path");
var templatesDir = path.resolve("./assets/app", "templates");
var emailTemplatesSync = Meteor.wrapAsync(emailTemplates);

var Future = Npm.require("fibers/future");
var sandstormDir = path.resolve("./assets/app", "sandstorm");
var capnp = Meteor.npmRequire('capnp');
var HackSession = capnp.import(path.resolve(sandstormDir, "hack-session.capnp"));

var promiseToFuture = function(promise) {
  var result = new Future();
  promise.then(result.return.bind(result), result.throw.bind(result));
  return result;
}

function waitPromise(promise) {
  return promiseToFuture(promise).wait();
}

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
  },

  acceptInvitation: function (id) {
    var invite = VotingInvites.findOne({_id: id});

    if (invite.accepted) {
      throw new Meteor.Error(500, "Invite has already been used");
    }

    Meteor.users.update({_id: Meteor.userId()}, {$set: {
      voteWeight: invite.voteWeight,
      isInvited: true
    }});
    VotingInvites.update({_id: id}, {$set: {accepted: true}});
  },

  sendInviteEmails: function (grainUrl) {
    if (!isAdmin(Meteor.user()))
      throw new Meteor.Error(403, "Not an admin");

    var template = emailTemplatesSync(templatesDir);
    var templateSync = Meteor.wrapAsync(template);
    var Render, csv_input, parsed_smtp, pass, send_mail, transportBatch, user;

    var connection = capnp.connect("unix:/tmp/sandstorm-api");
    var session = connection.restore("HackSessionContext", HackSession.HackSessionContext);
    var publicId = waitPromise(session.getPublicId());
    Render = function(locals) {
      this.locals = locals;
      this.send = function(err, html, text) {
        if (err) {
          console.log(err);
        } else {
          // TODO(someday): make this not wait on each promise and instead collect them in a list
          waitPromise(session.send({
            from: {name: "Sandstorm Voting App", address: publicId.publicId + "@" + publicId.hostname},
            to: [{address: locals.invitedUserEmail}],
            subject: "Sandstorm App Committee - Voting App Invite",
            html: html,
            text: text,
            date: (new Date().getTime()) * 1000000
          }));
        }
      };
      this.batch = function(batch) {
        batch(this.locals, templatesDir, this.send);
      };
    };
    var batch = templateSync("invite", true);
    VotingInvites.find().forEach(function (record) {
      record.grainUrl = grainUrl;
      record.inviteLink = grainUrl + '/voteInvitation/' + record._id;
      var render = new Render(record);
      render.batch(batch);
    })
  }
});
