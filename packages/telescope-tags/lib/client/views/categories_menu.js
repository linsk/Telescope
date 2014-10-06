Meteor.startup(function () {
  Template[getTemplate('categoriesMenu')].helpers({
    hasCategories: function(){
      return typeof Categories !== 'undefined' && Categories.find({name: {$nin: ['In-Progress', 'Updating', 'Ported']}}).count();
    },
    categories: function(){
      return Categories.find({name: {$nin: ['In-Progress', 'Updating', 'Ported']}}, {sort: {order: 1, name: 1}});
    },
    hasStatuses: function(){
      return typeof Categories !== 'undefined' && Categories.find({name: {$in: ['In-Progress', 'Updating', 'Ported']}}).count();
    },
    statuses: function(){
      return Categories.find({name: {$in: ['In-Progress', 'Updating', 'Ported']}}, {sort: {order: 1, name: 1}});
    },
    categoryLink: function () {
      return getCategoryUrl(this.slug);
    }
  });
});
