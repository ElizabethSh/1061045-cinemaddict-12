// функция превращает первую букву строки в заглавную
export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return string;
  }
  return string[0].toUpperCase() + string.slice(1);
};

// функция генерации случайного числа из диапозона
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const humanizeReleaseData = (date) => {
  return date.toLocaleString(`en-GB`, {day: `numeric`, month: `long`, year: `numeric`});
};

// метод обновления массива через замену изменившегося элемента
export const updateItem = (items, update) => {
  // ищем обновленный item в переданном массиве items
  const index = items.findIndex((item) => item.id === update.id);

  // если такого item в массиве нет, верни исходный массив
  if (index === -1) {
    return items;
  }

  // иначе перезапиши все items массива до обновленного item
  // в нов.массив, добавь обновленный item, и после этого
  // допиши оставшуюся часть массива туда же
  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};
