import { debounce } from './debounce.js';
import { searchCountries } from './searchCountries.js';
import { mapCountryResponse, type CountryCard } from './mapCountryResponse.js';
import { getSearchErrorInfo } from './errorHandler.js';

const app = document.createElement('div');
app.className = 'app';

const searchContainer = document.createElement('div');
const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Введите название страны...';

const contentContainer = document.createElement('div');

searchContainer.appendChild(input);
app.appendChild(searchContainer);
app.appendChild(contentContainer);
document.body.appendChild(app);

// Переменные состояния
let lastQuery = '';
let currentController: AbortController | null = null;

//Функции отрисовки
//Функции очистки контента
function clearContent() {
  while (contentContainer.firstChild) {
    contentContainer.removeChild(contentContainer.firstChild);
  }
}

//Функция "загрузка..."
function showLoading() {
  clearContent();
  const loading = document.createElement('div');
  loading.className = 'loader';
  loading.textContent = 'Загрузка...';
  contentContainer.appendChild(loading);
}
//Функция "ничего не найдено"
function showEmpty() {
  clearContent();
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  empty.textContent = ' ничего не найдено';
  contentContainer.appendChild(empty);
}
//Функция показа ошибки
function showError(message: string, canRetry: boolean, retryCallback: () => void) {
  clearContent();
  const errorContainer = document.createElement('div');
  errorContainer.className = ' error-state';

  const errorText = document.createElement('p');
  errorText.textContent = message;
  errorContainer.appendChild(errorText);

  if (canRetry === true) {
    const retryBtn = document.createElement('button');
    retryBtn.textContent = 'Повторить';
    retryBtn.addEventListener('click', retryCallback);
    errorContainer.appendChild(retryBtn);
  }
  contentContainer.appendChild(errorContainer);
}
//Функция показа карточек
function showResults(cards: CountryCard[]) {
  clearContent();
  if (cards.length === 0) {
    showEmpty();
    return;
  }
  const grid = document.createElement('div');
  grid.className = 'cards-grid';

  cards.forEach((card) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';

    const img = document.createElement('img');
    img.src = card.flag;
    img.alt = `Флаг ${card.name}`;

    const title = document.createElement('p');
    title.textContent = card.name;

    const capital = document.createElement('p');
    capital.textContent = `Столица: ${card.capital}`;

    const region = document.createElement('p');
    region.textContent = `Регион: ${card.region}`;

    const pop = document.createElement('p');
    pop.textContent = `Население: ${card.population.toLocaleString()}`;

    cardElement.appendChild(img);
    cardElement.appendChild(title);
    cardElement.appendChild(capital);
    cardElement.appendChild(region);
    cardElement.appendChild(pop);

    grid.appendChild(cardElement);
  });
  contentContainer.appendChild(grid);
}
//Главная функция поиска

async function performSearch(query: string) {
  if (!query) {
    clearContent();
    return;
  }

  showLoading();

  if (currentController) {
    currentController.abort();
  }
  currentController = new AbortController();

  try {
    const rawData = await searchCountries(query, currentController.signal);
    if (rawData.length === 0) {
      showEmpty();
    } else {
      const cards = rawData.map(mapCountryResponse);
      showResults(cards);
    }
  } catch (error) {
    const errorInfo = getSearchErrorInfo(error);
    if (errorInfo) {
      showError(errorInfo.message, errorInfo.canRetry, () => {
        performSearch(lastQuery);
      });
    }
  }
}

// задержка и обработчик ввода
const debouncedSearch = debounce(performSearch, 300);
input.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  const query = target.value.trim();
  lastQuery = query;
  if (currentController) {
    currentController.abort();
  }
  if (query === '') {
    clearContent();
    debouncedSearch('');
    return;
  }
  debouncedSearch(query);
});
