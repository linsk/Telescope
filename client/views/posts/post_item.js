var filteredModules = function (group) {
  // return the modules whose positions start with group
  return _.filter(postModules, function(module){return module.position.indexOf(group) == 0});
};

var post = {};

Template[getTemplate('post_item')].created = function () {
  post = this.data;
};

Template[getTemplate('post_item')].helpers({
  leftPostModules: function () {
    return filteredModules('left');
  },
  centerPostModules: function () {
    return filteredModules('center');
  },
  rightPostModules: function () {
    return filteredModules('right');
  },
  getTemplate: function () {
    return getTemplate(this.template);
  },
  moduleContext: function () { // not used for now
    var module = this;
    module.templateClass = camelToDash(this.template) + ' ' + this.position + ' cell';
    module.post = post;
    return module;
  },
  moduleClass: function () {
    return camelToDash(this.template) + ' ' + this.position + ' cell';
  },
  isPorted: function () {
    var res = _.where(this.categories, {name: "Ported"});
    return res.length > 0;
  },
  isInProgress: function () {
    var res = _.where(this.categories, {name: "In-Progress"});
    return res.length > 0;
  },
  isUpdating: function () {
    var res = _.where(this.categories, {name: "Updating"});
    return res.length > 0;
  }
});
