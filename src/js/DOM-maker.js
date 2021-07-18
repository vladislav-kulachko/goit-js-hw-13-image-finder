import createImgCard from '../templates/img-card.hbs';
import ApiService from '/js/api-service.js';
import debounce from 'lodash.debounce';
import { alert, error, info, defaults, Stack } from '@pnotify/core';
import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/PNotify.css';
import 'material-design-icons/iconfont/material-icons.css';
defaults.styling = 'material';
defaults.icons = 'material';
defaults.width = '500px';
defaults.delay = '4000';
import * as basicLightbox from 'basiclightbox';

const myStack = new Stack({
  dir1: 'down',
  dir2: 'right',
  firstpos1: 5,
  firstpos2: 5,
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

const imgApiService = new ApiService();

const observer = new IntersectionObserver(onLoadMoreScroll, {
  threshold: 0,
});

observer.observe(anchor);

loadMoreBtn.style.display = 'none';

let query;

function parseMarkup(images) {
  galleryContainer.insertAdjacentHTML('beforeend', createImgCard(images));
}

function inputHandler(e) {
  query = e.target.value;
  imgApiService.clearRes();
  if (query === '') {
    galleryContainer.innerHTML = '';
    loadMoreBtn.style.display = 'none';
  }

  imgApiService.currentQuery = query;

  if (query) {
    (async () => {
      const images = await imgApiService.fetchImg();
      galleryContainer.innerHTML = '';
      parseMarkup(images);
      if (images.length === 0) {
        error({
          text: 'Photo not found!',
          stack: myStack,
        });
      }
      if (images.length === 12) {
        loadMoreBtn.style.display = 'block';
      }
      if (images.length < 12) {
        loadMoreBtn.style.display = 'none';
      }
    })();
  }
}

function onLoadMore() {
  if (query) {
    (async () => {
      let images = await imgApiService.fetchImg();
      parseMarkup(images);
      const id = await images[images.length - 4].id;
      const element = document.getElementById(`${id}`);
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
      if (images.length < 12) {
        loadMoreBtn.style.display = 'none';
        alert({
          text: 'No more photos were found for this request!',
          stack: myStack,
        });
      }
    })();
  }
}

function onLoadMoreScroll([entry]) {
  if (!entry.isIntersecting) return;
  if (query) {
    (async () => {
      let images = await imgApiService.fetchImg();
      parseMarkup(images);
      const id = images[images.length - 1].id;
      const element = document.getElementById(`${id}`);
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
      if (images.length < 12) {
        loadMoreBtn.style.display = 'none';
        alert({
          text: 'No more photos were found for this request!',
          stack: myStack,
        });
      }
    })();
  }
}

function imgClickHandler(e) {
  if (e.target.dataset.source) {
    const fulImage = e.target.dataset.source;
    const lightbox = basicLightbox.create(`<img src="${fulImage}">`);
    lightbox.show();
  }
}
