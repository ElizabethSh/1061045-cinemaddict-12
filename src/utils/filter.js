import {FilterType} from "../const.js";

export const filter = {
  [FilterType.ALL]: (films) => films.slice(),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isHistory),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorites)
};
