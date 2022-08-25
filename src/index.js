import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import templateFunction from './template.hbs';
import template2Function from './template2.hbs';
const DEBOUNCE_DELAY = 1000;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
  popEl: document.querySelector('#population'),
};
refs.inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(event) {
  const inputText = event.target.value.trim();

  fetchCountries(inputText)
      .then(country => {
        
      function checkMatches() {
          if (country.length <= 10 && country.length >= 2) {
            const parsedDataMore = country.map(el => ({
            ...el,
                names: Object.values(el.names),
                flags: Object.values(el.flags),
          }));
          refs.countryListEl.innerHTML = template2Function(parsedDataMore[0]);
        } else if (country.length > 10) {
          Notiflix.Notify.failure(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (country.length === 1) {
            const parsedData = country.map(el => ({
              ...el,
              languages: Object.values(el.languages),
            }));
          refs.countryInfoEl.innerHTML = templateFunction(parsedData[0]);
        }
      }
      checkMatches();

      console.log(country);
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      console.log(error);
    });
}