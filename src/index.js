import Notiflix, { Loading } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onFormSubmit);
refs.btnLoadMore.addEventListener('click', onLoadMore);

function onFormSubmit(e) {
  e.preventDefault();
}

function onLoadMore(e) {}
