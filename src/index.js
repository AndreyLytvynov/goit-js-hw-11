import { getAllCountries } from './api';
import Notiflix from 'notiflix';

const galleryEl = document.querySelector('.gallery');
const searchFormEL = document.querySelector('.search-form');
const loadMoreBtnEl = document.querySelector('.load-more');

searchFormEL.addEventListener('submit', onSubmitForm);
loadMoreBtnEl.addEventListener('click', onClickLoadMoreBtn);

let nextPage = 1;
let calcHits = 0;
let totalHits;
let searchValue = '';

/**
 * Функция сабмита формы
 * @param {Event} e ивент формы
 */
async function onSubmitForm(e) {
  resetParameters();
  e.preventDefault();
  loadMoreBtnEl.classList.add('is-hidden');
  galleryEl.innerHTML = '';

  searchValue = e.currentTarget.searchQuery.value.trim();
  if (!searchValue) {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  await CreateAndAddMarkup(searchValue);
  if (calcHits >= totalHits) {
    return;
  }
}

/**
 * Функция выпоняется при событии "click", нажатии на кнопку "Load More"
 * @param {Event} e ивент клика по кнопке
 * @returns завержает исполнение функции если если текущее кол-во фото на странице >= максимальному кол-ву доспнупному на сервере
 */
async function onClickLoadMoreBtn(e) {
  loadMoreBtnEl.classList.add('is-hidden');
  await CreateAndAddMarkup(searchValue, nextPage);
  if (calcHits >= totalHits) {
    console.log('HVATIT');
    loadMoreBtnEl.classList.add('is-hidden');
    resetParameters();
    return;
  }
  loadMoreBtnEl.classList.remove('is-hidden');
}

/**
 * Генерирует и рендерит разметку на страницу
 * @param {*} name значение поля инпут, для поиска
 * @param {*} page страница api которую нужно загрузить
 * @returns завершение функции при проверках
 */
async function CreateAndAddMarkup(name, page) {
  try {
    const data = await getAllCountries(name, page);
    const arrData = data.hits;
    if (arrData.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    totalHits = data.totalHits;
    nextPage += 1;
    calcHits += arrData.length;

    const markup = arrData
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
        <div class="box-img"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></div>
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

    galleryEl.insertAdjacentHTML('beforeend', markup);

    loadMoreBtnEl.classList.remove('is-hidden');

    if (calcHits >= totalHits) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtnEl.classList.add('is-hidden');
      return;
    }
  } catch (error) {
    console.log(error, error.message);
  }
}

function resetParameters() {
  nextPage = 1;
  calcHits = 0;
  totalHits;
  searchValue = '';
}

// console.log(nextPage, ' -nextPage');
// console.log(calcHits, ' -calcHits');
// console.log(totalHits, ' -totalHits');
// console.log(searchValue, ' -searchValue');
