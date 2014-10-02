updateScore = function (args) {
  var collection = args.collection;
  var item = args.item;
  var forceUpdate = args.forceUpdate;

  var newScore = item.baseScore;
  collection.update(item._id, {$set: {score: newScore, inactive: false}});

  return 0;
};
