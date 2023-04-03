import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(evt) {
  evt.preventDefault();
  const countryName = evt.target.value.trim();
  fetchCountries(countryName)
    .then(res => {
      if (res.length > 10) {
        Notiflix.Notify.info(
          `Too many matches found. Please enter a more specific name.`
        );
        countryListEl.innerHTML = ``;
        countryInfoEl.innerHTML = '';
        return;
      } else if (res.length >= 2 && res.length <= 10) {
        const flagAndNameMarkup = markupFlagAndName(res);
        countryListEl.innerHTML = flagAndNameMarkup;
        countryInfoEl.innerHTML = '';
      } else {
        const countryInfoMarkup = markupCountryInfo(res);
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = countryInfoMarkup;
      }
    })
    .catch(error => {
      countryListEl.innerHTML = '';
      countryInfoEl.innerHTML = '';
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function markupFlagAndName(res) {
  const markup = res
    .map(({ name, flags }) => {
      return `
          <li>
<div class = "card-item"> 
          <img src="${flags.svg}" alt="Flag of ${name.official}" width = 24px>
            <h1 class="card-"> ${name.common}</h1>
 </div>
          </li>
                `;
    })
    .join('');
  return markup;
}

function markupCountryInfo(res) {
  const markup = res
    .map(({ name, capital, population, flags, languages }) => {
      return `
      <li">
      <div class = "card-item"> 
      <img src="${flags.svg}" alt="Flag of ${name.official}" width = 48px>
      <p class="name-official">${name.official}</p>
      </div>
      <p> <span class="info-span">Capital: </span>${capital}</p>
      <p> <span class="info-span">Population: </span>${population}</p>
      <p> <span class="info-span">Languages: </span>${Object.values(
        languages
      )}</p>

     </li>
      `;
    })
    .join('');
  return markup;
}
