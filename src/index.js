import axios from 'axios';
import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import result from './js/btnUp';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMore.addEventListener('click', onLoadMore);

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let page = 1;
let isVisible = 0;

function onFormSubmit(evt) {
  evt.preventDefault();
  isVisible = 0;
  refs.gallery.innerHTML = '';

  const name = refs.form.elements.searchQuery.value.trim();

  if (name !== '') {
    pixabayAPI(name);
  } else {
    refs.loadMore.classList.add('is-hidden');
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function pixabayAPI(name, page) {
  const BASE_URL = 'https://pixabay.com/api/';

  const options = {
    params: {
      key: '34300541-9ea07d11e1c55e84f488b0732',
      q: name,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    },
  };

  try {
    const response = await axios.get(BASE_URL, options);
    isVisible += response.data.hits.length;

    message(
      response.data.hits.length,
      isVisible,
      options.params.per_page,
      response.data.total
    );

    createMarkup(response.data);
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(arr) {
  const markup = arr.hits
    .map(
      item =>
        `<a class="gallery-item" href="${item.largeImageURL}">
            <div class="photo-card">
            <div class="photo">
            <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
            </div>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            ${item.likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            ${item.views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            ${item.comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            ${item.downloads}
                        </p>
                    </div>
            </div>
        </a>`
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  simpleLightBox.refresh();
}

function message(length, isVisible, per_page, total) {
  if (!length) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (length >= isVisible) {
    refs.loadMore.classList.remove('is-hidden');
    Notify.info(`Hooray! We found ${total} images.`);
  }
  if (isVisible >= total) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    refs.loadMore.classList.add('is-hidden');
  }
}

function onLoadMore() {
  refs.loadMore.classList.add('is-hidden');
  page += 1;
  const name = refs.form.elements.searchQuery.value.trim();
  pixabayAPI(name, page);
  refs.loadMore.classList.remove('is-hidden');
}
