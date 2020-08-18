import {capitalizeFirstLetter} from "../utils/common.js";

const filmToFilterMap = {
  favorites: (films) => films.filter((film) => film.isFavorites).length,
  watchlist: (films) => films.filter((film) => film.isWatchlist).length,
  history: (films) => films.filter((film) => film.isHistory).length
};

export const generateFilters = (films) => {
  return Object.entries(filmToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: capitalizeFirstLetter(filterName),
      count: countFilms(films)
    };
  });
};

