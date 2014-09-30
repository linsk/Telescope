updateScore = function (args) {
  var collection = args.collection;
  var item = args.item;
  var forceUpdate = args.forceUpdate;

  // TODO: weight this by users
  var newScore = collection.findOne(item._id).upvotes;
  collection.update(item._id, {$set: {score: newScore, inactive: false}});

  return 0;
};
