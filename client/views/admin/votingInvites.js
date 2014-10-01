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
