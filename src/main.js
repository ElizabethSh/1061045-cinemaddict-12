import ProfileView from "./view/profile.js";
import MainNavigationView from "./view/main-navigation.js";
import SortView from "./view/sort.js";
import StatisticView from "./view/statistic.js";
import MovieListPresenter from "./presenter/movie-list.js";
import {generateFilm} from "./mock/film-card-mock";
import {generateFilters} from "./mock/filter-mock";
import {render, RenderPosition} from "./utils/render.js";

const MAX_FILMS_CARD = 11; // 11, чтобы было видно как работают фильтры

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);
const footerStatistic = siteFooter.querySelector(`.footer__statistics`);

const films = new Array(MAX_FILMS_CARD).fill().map(generateFilm);
const filters = generateFilters(films);

const movieListPresenter = new MovieListPresenter(siteMain);

// HEADER
render(siteHeader, new ProfileView(), RenderPosition.BEFOREEND);

// MAIN
// рендерит фильтры
render(siteMain, new MainNavigationView(filters), RenderPosition.BEFOREEND);

// рендерит сортировку
render(siteMain, new SortView(), RenderPosition.BEFOREEND);

// рендерит контент с тремя разделами фильмов
movieListPresenter.init(films);

// FOOTER
render(footerStatistic, new StatisticView(films).getElement(), RenderPosition.BEFOREEND);

