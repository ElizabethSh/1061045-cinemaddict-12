import moment from "moment";

// функция превращает первую букву строки в заглавную
export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return string;
  }
  return string[0].toUpperCase() + string.slice(1);
};

export const formatReleaseData = (date) => {
  if (!(date instanceof Date)) {
    return ``;
  }
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatDescription = (descriptionText) => {
  if (descriptionText.length < 140) {
    return descriptionText;
  }

  return `${descriptionText.slice(0, 139)}...`;
};

export const formatDate = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:mm`);
};

export const formatFilmDuration = (durationInMinutes) => {
  return moment.utc().startOf(`day`).add({minutes: durationInMinutes}).format(`H[h] mm[m]`);
};

