export type GameFeedbackRating = 1 | 2 | 3 | 4 | 5;

export type GameFeedbackInput = {
  gameId: string;
  gameName: string;
  rating: GameFeedbackRating;
  sourcePath: string;
  userAgent?: string;
};
