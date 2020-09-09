import MainNavigationView from "../view/main-navigation.js";
import {FilterType, UpdateType} from "../const.js";
import {filter} from "../utils/filter.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {capitalizeFirstLetter} from "../utils/common.js";

export default class Filter {
  constructor(filterContainer, filterModel, FilmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = FilmsModel;
    this._currentFilter = null;
    this._mainNavigationComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevMainNavigationComponent = this._mainNavigationComponent;

    this._mainNavigationComponent = new MainNavigationView(filters, this._currentFilter);
    this._mainNavigationComponent.setFilterTypeClickHandler(this._handleFilterTypeChange);

    if (prevMainNavigationComponent === null) {
      render(this._filterContainer, this._mainNavigationComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this._mainNavigationComponent, prevMainNavigationComponent);
    remove(prevMainNavigationComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: capitalizeFirstLetter(FilterType.ALL),
        count: films.length
      },
      {
        type: FilterType.WATCHLIST,
        name: capitalizeFirstLetter(FilterType.WATCHLIST), // имя фильитра на сайте
        count: filter[FilterType.WATCHLIST](films).length
      },
      {
        type: FilterType.HISTORY,
        name: capitalizeFirstLetter(FilterType.HISTORY), // имя фильитра на сайте
        count: filter[FilterType.HISTORY](films).length
      },
      {
        type: FilterType.FAVORITES,
        name: capitalizeFirstLetter(FilterType.FAVORITES), // имя фильитра на сайте
        count: filter[FilterType.FAVORITES](films).length
      }
    ];
  }
}
