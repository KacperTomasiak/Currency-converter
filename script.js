//Variables
const fromCurrencySelect = document.querySelector('#from-currency-select');
const toCurrencySelect = document.querySelector('#to-currency-select');
const fromCurrency = document.querySelector('#from-currency');
const toCurrency = document.querySelector('#to-currency');
const disclaimer = document.querySelector('#disclaimer');
const arrows = document.querySelector('.fa-arrows-rotate');
const notification = document.querySelector('#notification');

//Functions
async function getAndChangeCurrenciesOnLoad(next) {
  const host = 'api.frankfurter.app';
  let query = await fetch(`https://${host}/currencies`);
  let res = await query.json();
  let arr = [];
  for (let key in res) {
    arr.push(key);
  }
  for (let i in arr) {
    let option = document.createElement('option');
    option.innerHTML = arr[i];
    fromCurrencySelect.appendChild(option);
  }
  for (let i in arr) {
    let option = document.createElement('option');
    option.innerHTML = arr[i];
    toCurrencySelect.appendChild(option);
  }
  fromCurrencySelect.value = 'USD';
  toCurrencySelect.value = 'EUR';
  next();
}

function checkAndFixErrors() {
  if (fromCurrencySelect.value == toCurrencySelect.value) {
    if (toCurrencySelect.selectedIndex == 30) {
      toCurrencySelect.selectedIndex = 0;
    } else {
      toCurrencySelect.selectedIndex += 1;
    }
    notification.classList.add('transition');
    notification.innerHTML = 'Currencies have to be different!';
    setTimeout(() => {
      notification.classList.remove('transition');
    }, 3500);
  }
  if (fromCurrency.value == '' || fromCurrency.value == 0) {
    notification.classList.add('transition');
    notification.innerHTML = 'Value has to be a number greater than zero!';
    setTimeout(() => {
      notification.classList.remove('transition');
    }, 3500);
    fromCurrency.value = '100';
  }
  if (toCurrency.value == '' || toCurrency.value == 0) {
    notification.classList.add('transition');
    notification.innerHTML = 'Value has to be a number greater than zero!';
    setTimeout(() => {
      notification.classList.remove('transition');
    }, 3500);
    toCurrency.value = '100';
  }
}

async function convertFirstCurrency() {
  const host = 'api.frankfurter.app';
  let res = await fetch(`https://${host}/latest?amount=${fromCurrency.value}&from=${fromCurrencySelect.value}&to=${toCurrencySelect.value}`);
  let data = await res.json();
  toCurrency.value = eval('data.rates.' + toCurrencySelect.value).toFixed(2);
  getCurrentRate();
}

async function convertSecondCurrency() {
  const host = 'api.frankfurter.app';
  let res = await fetch(`https://${host}/latest?amount=${toCurrency.value}&from=${toCurrencySelect.value}&to=${fromCurrencySelect.value}`);
  let data = await res.json();
  fromCurrency.value = eval('data.rates.' + fromCurrencySelect.value).toFixed(2);
  getCurrentRate();
}

function getCurrentRate() {
  disclaimer.textContent = `Rate: 1 ${fromCurrencySelect.value} ~ ${(toCurrency.value / fromCurrency.value).toFixed(2)} ${toCurrencySelect.value}`;
}

function changeCurrencies() {
  let temp = fromCurrencySelect.value;
  fromCurrencySelect.value = toCurrencySelect.value;
  toCurrencySelect.value = temp;
}

//Event listeners
document.addEventListener('DOMContentLoaded', () => {
  getAndChangeCurrenciesOnLoad(convertFirstCurrency);
});
fromCurrency.addEventListener('input', () => {
  checkAndFixErrors();
  convertFirstCurrency();
});
toCurrency.addEventListener('input', () => {
  checkAndFixErrors();
  convertSecondCurrency();
});
arrows.addEventListener('click', () => {
  changeCurrencies();
  checkAndFixErrors();
  convertFirstCurrency();
});
fromCurrencySelect.addEventListener('change', () => {
  checkAndFixErrors();
  convertFirstCurrency();
});
toCurrencySelect.addEventListener('change', () => {
  checkAndFixErrors();
  convertFirstCurrency();
});