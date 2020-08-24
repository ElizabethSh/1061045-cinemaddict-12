import SortView from "../view/sort.js";
import MovieListPresenter from "../presenter/movie-list.js";
import ContentView from "../view/content.js";
import {render, RenderPosition} from "../utils/render.js";
import {SortType} from "../const.js";
import {sortByDate, sortByRating} from "../utils/film.js";

export default class Sort {
  constructor(container) {
    this._sortContainer = container;
    this._contentComponent = new ContentView();
    this._contentContainer = this._contentComponent.getElement();
    this._sortComponent = new SortView();
    this._curentSortType = SortType.DEFAULT;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films) {
    this._renderSort();
    this._boardFilms = films.slice();

    this._sourcedFilms = films.slice();
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._boardFilms.sort(sortByDate);
        console.log(this._boardFilms);
        break;

      case SortType.RATING:
        this._boardFilms.sort(sortByRating);
        console.log(this._boardFilms);
        break;

      default:
        this._boardFilms = this._sourcedFilms.slice();
        console.log(`default`);
    }

    this._curentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    const movieListPresenter = new MovieListPresenter();
    console.log(movieListPresenter);
    // если выбранная сортировка совпадает с текущей, ничего не делай
    if (this._curentSortType === sortType) {
      return;
    }
    // - Сортируем задачи
    this._sortFilms(sortType);
    // - Очищаем список
    movieListPresenter.clearFilmList();

    // - Рендерим список заново
    movieListPresenter.renderAllFilmList();

  }

  _renderSort() {
    render(this._sortContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChange(this._handleSortTypeChange);
  }

}
