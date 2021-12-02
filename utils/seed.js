exports.createGamesRef = (games) => {
  return games.reduce((ref, game) => {
    ref[game.game_title] = game.game_id;
    return ref;
  }, {});
};

exports.formatReviewsData = (reviewData, gamesRef) => {
  return reviewData.map(({ game_title, ...restOfReview }) => {
    return { ...restOfReview, game_id: gamesRef[game_title] };
  });
};
