export type Movie = {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  genre: string;
  cast: string;
  trailerUrl: string;
  imdbRating: number;
  releaseYear: number;
};

export type User = { token: string; userId: number; name: string; email: string };

export type WatchlistItem = {
  id: number;
  movieId: number;
  status: "PlanToWatch" | "Watched";
  movie: Movie;
};

export type Review = {
  id: number;
  movieId: number;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
};
