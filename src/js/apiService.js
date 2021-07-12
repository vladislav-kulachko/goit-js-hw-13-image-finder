import createImgCard from '../templates/img-card.hbs';
import debounce from 'lodash.debounce';
import { alert, defaults } from '@pnotify/core';
import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/PNotify.css';
import 'material-design-icons/iconfont/material-icons.css';
defaults.styling = 'material';
defaults.icons = 'material';

const countriesFoundContainer = document.querySelector('.found-countries-list');
const countryCard = document.querySelector('.country-card');
const findInput = document.querySelector('.country-search__input');
findInput.addEventListener('input', debounce(inputHandler, 500));
countriesFoundContainer.addEventListener('click', countryListClick);

function inputHandler(e) {
  if (e.target.value === '') {
    countriesFoundContainer.innerHTML = '';
    countryCard.innerHTML = '';
  }

  if (e.target.value) {
    fetchCountry(e.target.value)
      .then(countries => {
        if (countries.length === 1) {
          parseMarkupCountryCard(countries);
          countriesFoundContainer.innerHTML = '';
        }
        return countries;
      })
      .then(countries => {
        if (countries.length > 1 && countries.length <= 10) {
          parseMarkupFoundCountries(countries);
          countryCard.innerHTML = '';
        }
        return countries;
      })
      .then(countries => {
        if (countries.length >= 11) {
          alert({
            text: 'Найдено cлишком большое колличество стран. Сделайте запрос более специфичным.',
          });
          countriesFoundContainer.innerHTML = '';
          countryCard.innerHTML = '';
        }
        return countries;
      })
      .then(countries => {
        if (countries.status === 404) {
          alert({
            text: 'Страна не найдена!',
          });
          countriesFoundContainer.innerHTML = '';
          countryCard.innerHTML = '';
        }
      });
  }
}

function countryListClick(e) {
  if (e.target.classList.contains('found-countries-list__item')) {
    fetchCountry(e.target.textContent).then(parseMarkupCountryCard);
  }
}

function parseMarkupCountryCard(countries) {
  countryCard.innerHTML = createCountryCard(countries);
}

function parseMarkupFoundCountries(countries) {
  countriesFoundContainer.innerHTML = createMarkupFoundCountries(countries);
}

function createMarkupFoundCountries(countries) {
  return countries.reduce(
    (markup, country) => markup + `<li class="found-countries-list__item">${country.name}</li>`,
    '',
  );
}

async function fetchCountry(country) {
  const responce = await fetch(`https://restcountries.eu/rest/v2/name/${country}`);
  return await responce.json();
}
