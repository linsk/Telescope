Meteor.startup(function () {
  if (Categories.find().fetch().length < 1) {

    Categories.insert({
      name: 'In-Progress',
      order: 1,
      slug: slugify('In-Progress')
    });
    Categories.insert({
      name: 'Ported',
      order: 2,
      slug: slugify('Ported')
    });
    Categories.insert({
      name: 'Updating',
      order: 3,
      slug: slugify('Updating')
    });
  }
});
