import MainNavigationView from "../view/main-navigation.js";
import {FilterType} from "../const.js";
import {filter} from "../utils/filter.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {capitalizeFirstLetter} from "../utils/common.js";

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel, selectMenuItem) {
    this._container = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._selectMenuItem = selectMenuItem;
    this._currentFilter = null;
    this._mainNavigationComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.add(this._handleModelEvent);
    this._filterModel.add(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.get();

    const filters = this._getFilters();
    const prevMainNavigationComponent = this._mainNavigationComponent;

    this._mainNavigationComponent = new MainNavigationView(filters, this._currentFilter);
    this._mainNavigationComponent.setFilterTypeClickHandler(this._selectMenuItem);
    this._mainNavigationComponent.setStatsClickHandler(this._selectMenuItem);

    if (prevMainNavigationComponent === null) {
      render(this._container, this._mainNavigationComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this._mainNavigationComponent, prevMainNavigationComponent);
    remove(prevMainNavigationComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _getFilters() {
    const films = this._filmsModel.get();

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
