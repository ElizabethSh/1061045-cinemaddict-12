import ProfileView from "./view/profile.js";
import MainNavigationView from "./view/main-navigation.js";
import SortView from "./view/sort.js";
import ContentView from "./view/content.js";
import AllFilmSectionView from "./view/all-film-section.js";
import AllFilmListView from "./view/all-film-list.js";
import ShowMoreButtonView from "./view/show-more-button.js";
import FilmCardView from "./view/film-card.js";
import TopRatedListView from "./view/top-rated-list.js";
import MostCommentedListView from "./view/most-commented-list.js";
import StatisticView from "./view/statistic.js";
import PopupView from "./view/popup.js";
import FilmInfoView from "./view/film-info.js";
import FilmInfoControlView from "./view/film-control.js";
import CommentView from "./view/comment.js";
import {generateFilm} from "./mock/film-card-mock";
import {generateFilters} from "./mock/filter-mock";
import {render, RenderPosition} from "./utils.js";

const MAX_FILMS_CARD = 11; // 11, чтобы было видно как работают фильтры
const MAX_FILMS_PER_STEP = 5;
const MAX_EXTRA_FILMS_CARD = 2;

const body = document.querySelector(`body`);
const siteHeader = body.querySelector(`.header`);
const siteMain = body.querySelector(`.main`);
const siteFooter = body.querySelector(`.footer`);
const footerStatistic = siteFooter.querySelector(`.footer__statistics`);

const films = new Array(MAX_FILMS_CARD).fill().map(generateFilm);
const filters = generateFilters(films);

const renderFilmCard = (filmList, film) => {
  const filmCardComponent = new FilmCardView(film);
  const popupComponent = new PopupView(film);
  const filmDetailComponent = popupComponent.getElement().querySelector(`.form-details__top-container`);
  const filmInfoComponent = new FilmInfoView(film);
  const filmInfoControlComponent = new FilmInfoControlView();
  const commentComponent = new CommentView(film);

  const poster = filmCardComponent.getElement().querySelector(`.film-card__poster`);
  const title = filmCardComponent.getElement().querySelector(`.film-card__title`);
  const commentAmount = filmCardComponent.getElement().querySelector(`.film-card__comments`);
  const popupCloseButton = popupComponent.getElement().querySelector(`.film-details__close-btn`);

  const openPopup = () => {
    body.appendChild(popupComponent.getElement());
    render(filmDetailComponent, filmInfoComponent.getElement(), RenderPosition.BEFOREEND);
    render(filmDetailComponent, filmInfoControlComponent.getElement(), RenderPosition.BEFOREEND);
    render(filmDetailComponent, commentComponent.getElement(), RenderPosition.AFTEREND);

    popupCloseButton.addEventListener(`click`, onCloseButtonClick);
    poster.removeEventListener(`click`, onPosterClick);
    title.removeEventListener(`click`, onTitleClick);
    commentAmount.removeEventListener(`click`, onCommentAmountClick);
  };

  const closePopup = () => {
    body.removeChild(popupComponent.getElement());

    popupCloseButton.removeEventListener(`click`, onCloseButtonClick);
    poster.addEventListener(`click`, onPosterClick);
    title.addEventListener(`click`, onTitleClick);
    commentAmount.addEventListener(`click`, onCommentAmountClick);
  };

  const onPosterClick = () => {
    openPopup();
  };

  const onTitleClick = () => {
    openPopup();
  };

  const onCommentAmountClick = () => {
    openPopup();
  };

  const onCloseButtonClick = () => {
    closePopup();
  };

  poster.addEventListener(`click`, onPosterClick);
  title.addEventListener(`click`, onTitleClick);
  commentAmount.addEventListener(`click`, onCommentAmountClick);

  render(filmList, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
};

// header
render(siteHeader, new ProfileView().getElement(), RenderPosition.BEFOREEND);

// main
render(siteMain, new MainNavigationView(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMain, new SortView().getElement(), RenderPosition.BEFOREEND);

const siteContentComponent = new ContentView();
render(siteMain, siteContentComponent.getElement(), RenderPosition.BEFOREEND);

const filmsBoardComponent = new AllFilmSectionView();
render(siteContentComponent.getElement(), filmsBoardComponent.getElement(), RenderPosition.AFTERBEGIN); // All films list

const AllFilmListComponent = new AllFilmListView();
render(filmsBoardComponent.getElement(), AllFilmListComponent.getElement(), RenderPosition.BEFOREEND);
render(siteContentComponent.getElement(), new TopRatedListView().getElement(), RenderPosition.BEFOREEND); // Top Rated films list
render(siteContentComponent.getElement(), new MostCommentedListView().getElement(), RenderPosition.BEFOREEND);// Most commented films list


// создание карточек фильмов в разделе "Все фильмы"
for (let i = 0; i < Math.min(films.length, MAX_FILMS_PER_STEP); i++) {
  renderFilmCard(AllFilmListComponent.getElement(), films[i]);
}

// если карточек больше 5, показывает 5 карточек и кнопку Show more
if (films.length > MAX_FILMS_PER_STEP) {
  let renderedFilmAmount = MAX_FILMS_PER_STEP;
  const showMoreButtonComponent = new ShowMoreButtonView();

  // отображает кнопку
  render(filmsBoardComponent.getElement(), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  // функция для дополнительного показа карточек по 5 штук
  const showCards = () => {

    films.slice(renderedFilmAmount, renderedFilmAmount + MAX_FILMS_PER_STEP)
      .forEach((film) => renderFilmCard(AllFilmListComponent.getElement(), film));

    renderedFilmAmount += MAX_FILMS_PER_STEP;

    // если показаны все имеющиеся карточки, удаляет кнопку
    if (films.length <= renderedFilmAmount) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement(); // зачем?
    }
  };

  const onShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    showCards();
  };

  showMoreButtonComponent.getElement().addEventListener(`click`, onShowMoreButtonClick); // для дальнейшего удаления этого обработчика
}

const extraFilmLists = siteContentComponent.getElement().querySelectorAll(`.films-list--extra .films-list__container`);
extraFilmLists.forEach(function (it) {
  for (let i = 0; i < MAX_EXTRA_FILMS_CARD; i++) {
    renderFilmCard(it, films[i]);
  }
});

// footer
render(footerStatistic, new StatisticView(films).getElement(), RenderPosition.BEFOREEND);
