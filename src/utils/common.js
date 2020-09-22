import moment from "moment";

// функция превращает первую букву строки в заглавную
export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return string;
  }
  return string[0].toUpperCase() + string.slice(1);
};

// функция возвращает дату выхода фильма в формате - DD MMMM YYYY
export const formatReleaseData = (date) => {
  if (!(date instanceof Date)) {
    return ``;
  }
  return moment(date).format(`DD MMMM YYYY`);
};

// функция форматирования описания фильма в карточке
export const formatDescription = (descriptionText) => {
  if (descriptionText.length < 140) {
    return descriptionText;
  }

  return `${descriptionText.slice(0, 139)}...`;
};

// функция возвращет дату в формате YYYY/MM/DD HH:mm
export const formatDate = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:mm`);
};

// функция переводит продолжительность фильма из минут в часы и минуты
export const formatFilmDuration = (durationInMinutes) => {
  return moment.utc().startOf(`day`).add({minutes: durationInMinutes}).format(`H[h] mm[m]`);
};

export const convertTextToKebabCase = (text) => text.toLowerCase().split(` `).join(`-`);

export const convertToTextFromKebabCase = (string) => {
  const stringInLowerCase = string.split(`-`).join(` `);
  return stringInLowerCase[0].toUpperCase() + stringInLowerCase.slice(1);
};

