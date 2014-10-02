Template[getTemplate('votingInvites')].helpers({
  activeClass: function (link) {
    if(link == this.filterBy || link == this.sortBy)
      return "active";
  },
  sortBy: function (parameter) {
    return "?filterBy="+this.filterBy+"&sortBy="+parameter;
  },
  filterBy: function (parameter) {
    return "?filterBy="+parameter+"&sortBy="+this.sortBy;
  }
});

Template[getTemplate('votingInvites')].events({
  "click #uploadCsv": function(event) {
    var input;
    input = document.createElement("input");
    input.type = "file";
    input.style = "display: none";
    input.addEventListener("change", function(e) {
      var file, reader;
      file = e.currentTarget.files[0];
      reader = new FileReader();
      reader.onload = function(e) {
        return Meteor.call('uploadInvitationsCsv', reader.result, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('success');
          }
        });
      };
      return reader.readAsText(file);
    });
    input.click();
  }
});
