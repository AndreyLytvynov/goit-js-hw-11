import { getAllPages } from './api';
import Notiflix from 'notiflix';

const galleryEl = document.querySelector('.gallery');
const searchFormEL = document.querySelector('.search-form');
const loadMoreBtnEl = document.querySelector('.load-more');

searchFormEL.addEventListener('submit', onSubmitForm);
loadMoreBtnEl.addEventListener('click', onClickLoadMoreBtn);

let nextPage = 1;
let calcHits = 0;
let searchValue = '';

/**
 * Функция сабмита формы
 * @param {Event} e ивент формы
 */
async function onSubmitForm(e) {
  e.preventDefault();
  resetParameters();

  hiddenLoadBtn();
  galleryEl.innerHTML = '';

  searchValue = e.currentTarget.searchQuery.value.trim();
  if (!searchValue) {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  const data = await renderMarkup(searchValue);

  if (calcHits >= data.totalHits) {
    hiddenLoadBtn();
    return;
  }
}

/**
 * Функция выпоняется при событии "click", нажатии на кнопку "Load More"
 * @param {Event} e ивент клика по кнопке
 * @returns завержает исполнение функции если если текущее кол-во фото на странице >= максимальному кол-ву доспнупному на сервере
 */
async function onClickLoadMoreBtn(e) {
  hiddenLoadBtn();
  const data = await renderMarkup(searchValue, nextPage);
  if (calcHits >= data.totalHits) {
    console.log('HVATIT');
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );

    hiddenLoadBtn();
    resetParameters();
    return;
  }
  showsButton();

  //Прокручивание страницы при нажатии на кнопку "показать больше"
  const { height: cardHeight } =
    galleryEl.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2.5,
    behavior: 'smooth',
  });
}

/**
 * Генерирует и рендерит разметку на страницу
 * @param {*} name значение поля инпут, для поиска
 * @param {*} page страница api которую нужно загрузить
 * @returns завершение функции при проверках
 */
async function renderMarkup(name, page) {
  try {
    const data = await getAllPages(name, page);
    const arrData = data.hits;
    if (arrData.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    nextPage += 1;
    calcHits += arrData.length;

    const markup = createMarkup(arrData);

    galleryEl.insertAdjacentHTML('beforeend', markup);

    showsButton();
    return data;
  } catch (error) {
    console.log(error, error.message);
  }
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
    <div class="photo-card"> 
        <div class="box-img"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="300"/></div>
        <div class="info">
            <p class="info-item">
                <b>likes</b><span>${likes}</span>
            </p>
            <p class="info-item">
                <b>views</b><span>${views}</span>
            </p>
            <p class="info-item">
                <b>comments</b><span>${comments}</span>
            </p>
            <p class="info-item">
                <b>downloads</b><span>${downloads}</span>
            </p>
        </div>
    </div>
          `;
      }
    )
    .join('');
}
function resetParameters() {
  nextPage = 1;
  calcHits = 0;
  searchValue = '';
}
function hiddenLoadBtn() {
  loadMoreBtnEl.classList.add('is-hidden');
}
function showsButton() {
  loadMoreBtnEl.classList.remove('is-hidden');
}
// console.log(nextPage, ' -nextPage');
// console.log(calcHits, ' -calcHits');
// console.log(totalHits, ' -totalHits');
// console.log(searchValue, ' -searchValue');
