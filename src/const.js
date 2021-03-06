export const EMOJIS = [`smile`, `sleeping`, `puke`, `angry`];

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export const UserAction = {
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`,
  UPDATE_FILM: `UPDATE_FILM`
};

export const UpdateType = {
  PATCH: `PATCH`, // обновляет список комментариев
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
  INIT_POPUP: `INIT_POPUP`
};

export const FilterType = {
  ALL: `all movies`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export const MenuItem = {
  FILTERS: `FILTERS`,
  STATISTICS: `STATISTICS`
};

export const StatsPeriod = {
  ALL_TIME: `All time`,
  TODAY: `Today`,
  WEEK: `Week`,
  MONTH: `Month`,
  YEAR: `Year`,
};

export const State = {
  UPDATING: `UPDATING`,
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export const UserRank = {
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};

export const UserRankRate = {
  NOVICE: 10,
  FAN: 20,
};
