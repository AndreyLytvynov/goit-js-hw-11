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

async function onSubmitForm(e) {
  e.preventDefault();
  galleryEl.innerHTML = '';
  nextPage = 1;
  calcHits = 0;
  const searchValue = e.currentTarget.searchQuery.value;
  await CreateAndAddMarkup(searchValue);
}

function onClickLoadMoreBtn(e) {
  if (calcHits >= totalHits) {
    console.log('HVATIT');
    return;
  }
  CreateAndAddMarkup('car', nextPage);
}

async function CreateAndAddMarkup(name, page) {
  try {
    const data = await getAllCountries(name, page);
    const arrData = data.hits;
    if (arrData.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    totalHits = data.totalHits;
    nextPage += 1;
    calcHits += arrData.length;

    //   console.log(nextPage);
    //   console.log(totalHits, calcHits);
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
        <img src="${webformatURL}" alt="${tags}" width="250" loading="lazy" />
        <div class="info">
            <p class="info-item">
                <b>${likes}</b>
            </p>
            <p class="info-item">
                <b>${views}</b>
            </p>
            <p class="info-item">
                <b>${comments}</b>
            </p>
            <p class="info-item">
                <b>${downloads}</b>
            </p>
        </div>
    </div>
          `;
        }
      )
      .join('');
    galleryEl.insertAdjacentHTML('beforeend', markup);
  } catch (error) {
    console.log(error, error.message);
  }
}
