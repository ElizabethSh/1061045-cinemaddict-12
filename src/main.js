import ProfileView from "./view/profile.js";
import MainNavigationView from "./view/main-navigation.js";
import ContentView from "./view/content.js";
import StatisticView from "./view/statistic.js";
import SortPresenter from "./presenter/sort.js";
import ExtraListPresenter from "./presenter/extra-list.js";
import MovieListPresenter from "./presenter/movie-list.js";
import NoTaskView from "./view/no-film.js";
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
const topRatedFilms = films.slice();
const mostCommentedFilms = films.slice();

const contentComponent = new ContentView();
const contentContainer = contentComponent.getElement();
const sortComponent = new SortPresenter(siteMain);
const movieListPresenter = new MovieListPresenter(contentContainer);
const noTaskComponent = new NoTaskView();
// console.log(films);
const topRatedHeader = `Top Rated`;
const mostCommentedHeader = `Most commented`;
const topRatedFilmsPresenter = new ExtraListPresenter(contentContainer, topRatedHeader);
const mostCommentedFilmsPresenter = new ExtraListPresenter(contentContainer, mostCommentedHeader);

// HEADER
render(siteHeader, new ProfileView(), RenderPosition.BEFOREEND);

// MAIN
// рендерит фильтры
render(siteMain, new MainNavigationView(filters), RenderPosition.BEFOREEND);

// рендерит сортировку
sortComponent.init(films);

// рендерит контент
if (films.length === 0) {
  // если фильмов нет, рендерим заглушку
  render(siteMain, noTaskComponent, RenderPosition.BEFOREEND);
}
// иначе отобрази контент с фильмами
render(siteMain, contentComponent, RenderPosition.BEFOREEND);


// рендерит контент с разделом всех фильмов
movieListPresenter.init(films);

// рендерит Most Commented раздел
topRatedFilmsPresenter.init(topRatedFilms);

// рендерит Top Rated раздел
mostCommentedFilmsPresenter.init(mostCommentedFilms, mostCommentedHeader);

// FOOTER
render(footerStatistic, new StatisticView(films).getElement(), RenderPosition.BEFOREEND);

