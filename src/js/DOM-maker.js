import createImgCard from '../templates/img-card.hbs';
// import imgApiService from '../js/api-service.js';
import debounce from 'lodash.debounce';
import { alert, error, info, defaults, Stack } from '@pnotify/core';
import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/PNotify.css';
import 'material-design-icons/iconfont/material-icons.css';
defaults.styling = 'material';
defaults.icons = 'material';
defaults.width = '300px';
defaults.delay = '3000';
import * as basicLightbox from 'basiclightbox';

const myStack = new Stack({
  dir1: 'down',
  dir2: 'right',
  firstpos1: 50,
  firstpos2: 500,
  push: 'bottom',
  context: document.body,
});

const galleryContainer = document.querySelector('.gallery');
const findInput = document.querySelector('[name="query"]');
const loadMoreBtn = document.querySelector('.load-more-button');
const anchor = document.querySelector('#anchor');
loadMoreBtn.addEventListener('click', onLoadMore);
findInput.addEventListener('input', debounce(inputHandler, 1000));
galleryContainer.addEventListener('click', imgClickHandler);

// const imgApiService = new apiService();

const observer = new IntersectionObserver(onLoadMoreScroll, {
  threshold: 0,
});

observer.observe(anchor);

async function fetchImg(query) {
  const API_KEY = '22469434-62330606312f34e078b383df4';
  const URL = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=12&key=${API_KEY} `;

  const res = await fetch(URL);
  page += 1;
  return await res.json();
}

let page = 1;
let query;
loadMoreBtn.style.display = 'none';

function inputHandler(e) {
  query = e.target.value;

  page = 1;

  if (query === '') {
    galleryContainer.innerHTML = '';
    loadMoreBtn.style.display = 'none';
  }

  // imgApiService.query = e.target.value;
  // imgApiService.clearRes();

  if (query) {
    fetchImg(query)
      .then(images => {
        galleryContainer.innerHTML = '';
        parseMarkup(images);
        return images;
      })
      .then(images => {
        if (images.hits.length === 0) {
          alert({
            text: 'Photo not found!',
            stack: myStack,
          });
        }
      })
      .then(() => {
        if (galleryContainer.children.length >= 12) {
          loadMoreBtn.style.display = 'inline-block';
        }
        if (galleryContainer.children.length < 12) {
          loadMoreBtn.style.display = 'none';
        }
      });
  }
}

function parseMarkup(images) {
  galleryContainer.insertAdjacentHTML('beforeend', createImgCard(images));
}

function onLoadMore() {
  if (query) {
    fetchImg(query)
      .then(images => {
        parseMarkup(images);
        return images.hits[images.hits.length - 4].id;
      })
      .then(id => {
        const element = document.getElementById(`${id}`);
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      });
  }
}

function onLoadMoreScroll([entry]) {
  if (!entry.isIntersecting) return;
  if (query) {
    fetchImg(query)
      .then(images => {
        parseMarkup(images);
        return images.hits[images.hits.length - 1].id;
      })
      .then(id => {
        const element = document.getElementById(`${id}`);
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      });
  }
}

function imgClickHandler(e) {
  if (e.target.dataset.source) {
    const largeImage = e.target.dataset.source;
    const lightbox = basicLightbox.create(`<img src="${largeImage}">`);

    lightbox.show();
  }
}
