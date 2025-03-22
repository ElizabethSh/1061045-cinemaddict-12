import {UserRank, UserRankRate} from "../const.js";

export const getRank = (films) => {
  if (films.length > 0 && films.length <= UserRankRate.NOVICE) {
    return UserRank.NOVICE;
  }

  if (films.length > UserRankRate.NOVICE && films.length <= UserRankRate.FAN) {
    return UserRank.FAN;
  }

  if (films.length > UserRankRate.FAN) {
    return UserRank.MOVIE_BUFF;
  }
  return null;
};

export const formatUserRank = (string) => {
  if (!string) {
    return;
  }

  const strings = string.split(` `);
  return strings.map((it) => it[0].toUpperCase() + it.slice(1)).join(`-`);
};
