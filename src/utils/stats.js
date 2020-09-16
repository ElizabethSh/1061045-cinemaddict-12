import moment from "moment";
import {StatsPeriod} from "../const.js";

export const getHoursAndMinutes = (duration) => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return {hours, minutes};
};

const getDateByPeriods = (period) => {
  const now = new Date();
  switch (period) {
    case StatsPeriod.TODAY:
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());

    case StatsPeriod.WEEK:
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);

    case StatsPeriod.MONTH:
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    case StatsPeriod.YEAR:
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  }
  return null;
};

export const countWatchedFilmsInDateRange = (films, period) => {
  const watchedFilms = [];
  const dateTo = new Date();
  const dateFrom = getDateByPeriods(period);

  if (dateFrom === null) {
    return films;
  }

  films.forEach((film) => {
    if (
      moment(film.watchingDate).isSame(dateFrom) ||
      moment(film.watchingDate).isBetween(dateFrom, dateTo) ||
      moment(film.watchingDate).isSame(dateTo)
    ) {
      watchedFilms.push(film);
    }
  });

  return watchedFilms;
};

const countFilmsByGenre = (films, selectedGenre) => {
  const filmsByGenre = films.filter((film) => {
    return film.genres.some((genre) => genre === selectedGenre);
  });

  return filmsByGenre.length;
};

const countGenres = (films) => {
  const allGenres = films.reduce((acc, film) => [...acc, ...film.genres], []);
  const unicGenres = [...new Set(allGenres)];
  const countedGenres = unicGenres.reduce((acc, genre) => {
    return Object.assign(acc, {[genre]: countFilmsByGenre(films, genre)});
  }, {});

  return countedGenres;
};

export const getSortedGenres = (films) => {
  const countedGenres = countGenres(films);
  const sorterGenres = Object.entries(countedGenres).sort((a, b) => b[1] - a[1]);
  return sorterGenres;
};

export const getTopGenre = (films) => {
  if (!films.length) {
    return `-`;
  }
  const sortedGenres = getSortedGenres(films);
  const [[topGenre]] = sortedGenres;

  return topGenre;
};

export const getTotalDuration = (films) => {
  return films.reduce((acc, film) => acc + film.runtime, 0);
};
