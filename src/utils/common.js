import moment from "moment";

const MAX_SYMBOL_AMOUNT = 139;

// функция превращает первую букву строки в заглавную
export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return string;
  }
  return string[0].toUpperCase() + string.slice(1);
};

// функция возвращает дату выхода фильма в формате - DD MMMM YYYY
export const formatReleaseData = (date) => {
  return (!(date instanceof Date)) ? `` : moment(date).format(`DD MMMM YYYY`);
};

// функция форматирования описания фильма в карточке
export const formatDescription = (descriptionText) => {
  return descriptionText.length <= MAX_SYMBOL_AMOUNT ? descriptionText : `${descriptionText.slice(0, MAX_SYMBOL_AMOUNT)}...`;
};

// функция возвращет дату в человеческом формате
export const formatDate = (date) => {
  return moment(date).fromNow();
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

export const update = (data, updatedData) => {
  if (!updatedData) {
    return data;
  }

  data = Object.assign(
      {},
      data,
      updatedData
  );

  return data;
};

