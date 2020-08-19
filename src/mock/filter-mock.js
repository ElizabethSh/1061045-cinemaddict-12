import {capitalizeFirstLetter} from "../utils/common.js";

const filmToFilterMap = {
  watchlist: (films) => films.filter((film) => film.isWatchlist).length,
  history: (films) => films.filter((film) => film.isHistory).length,
  favorites: (films) => films.filter((film) => film.isFavorites).length
};

export const generateFilters = (films) => {
  return Object.entries(filmToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: capitalizeFirstLetter(filterName),
      count: countFilms(films)
    };
  });
};

