export default class Store {
  constructor(key, storage) {
    // само хранилище, кот. может меняться,
    // чтобы не привязываться к конкрет.хранилищу
    // передаем его снаружи (м.б. LocalStorage, SessionStorage и т.д.)
    this._storage = storage;

    // ключ, под которым хрантся данные в localStorage
    this._storeKey = key;
  }

  // метод для обращения к хранилищу извлечения элементов
  // JSON.parse переводит то что было сохранено в виде строки
  // обратно в объект
  // данных может не быть. Если их нет, передаем пустой объект - {},
  // чтобы не было ошибок в работе
  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  getCommentsByFilmId(id) {
    const comments = Object.values(this.getItems());
    return comments.filter(({movieId}) => movieId === id);
  }

  // работает за счет метода setItem
  // позволяет сохранить несколько элементов - список фильмов или комментариев
  setItems(items) {
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(items)
    );
  }

  // метод для записи в хранилище
  setItem(key, value) {
    const store = this.getItems();

    // метод setItem реализован в интерфейсах хранилищ LocalStorage и SessionStorage
    // передаем 2 параметра
    this._storage.setItem(
        this._storeKey, // название ключа
        JSON.stringify( // то, что хотим сохранить

            // все данные, кот. приходят с сервера или
            // добавляет пользователь, сохраняем в виде строки
            // получаем строки из объекта с пом. JSON.stringify
            // эту строку сохраняем и потом можно достать из хранилища
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  // метод удаления данных из хранилища
  removeItem(key) {
    // получаем все сохраненные значения
    const store = this.getItems();

    // удаляем из полученных значений нужное значение
    // по ключу соответствующего объекта
    delete store[key];

    // снова сохраняем оставшиеся значения в хранилище
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(store)
    );
  }
}
