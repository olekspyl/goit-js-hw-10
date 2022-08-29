import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import templateFunction from './template.hbs';

const DEBOUNCE_DELAY = 300;

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
      .then(countries => {
        
        function checkMatches() {
        refs.countryListEl.innerHTML = ' ';
          if (countries.length <= 10 && countries.length >= 2) {
            
            const parsedDataMore = countries.map(({ name, flags }) => {
              return `<ul class='list'>
               <li class='template__group'><img src="${flags.svg}" alt="flag" width="50px" height="40px"/><p class="template__category">${name.common}</p></li>
              </ul>`})
              .join(' ');
            
            refs.countryListEl.innerHTML = parsedDataMore;
          }
          
          else if (countries.length > 10) {
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
          }
          
          else {
            refs.countryInfoEl.innerHTML = '';
            const parsedData = countries.map(country => ({

              ...country,
              languages: Object.values(country.languages),
            }));
          refs.countryInfoEl.innerHTML = templateFunction(parsedData[0]);
        }
      }
      checkMatches();

      console.log(countries);
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      

    });
}