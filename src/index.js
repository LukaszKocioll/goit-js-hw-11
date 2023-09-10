import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;

const API_KEY = '39359840-efcb8fae7f1af4010e3363a8b';

form.addEventListener('submit', handleSubmitForm);
loadMoreBtn.addEventListener('click', loadMoreImages);

async function handleSubmitForm(event) {
    event.preventDefault();
    gallery.innerHTML = '';
    page = 1;

    const searchQuery = form.querySelector('input[name="searchQuery"]').value;

    if (searchQuery.trim() === '') {
        Notiflix.Notify.failure('Proszę wprowadź zapytanie do wyszukiwarki.');
        return;
    }

    try {
        const response = await axios.get('https://pixabay.com/api/', {
            params: {
                key: API_KEY,
                q: searchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page,
                per_page: 40,
            },
        });

        const { data } = response;

        if (data.hits.length === 0) {
            Notiflix.Notify.warning('Brak obrazków pasujących do zapytania.');
            return;
        }

        renderImages(data.hits);

        if (data.totalHits <= page * 40) {
            loadMoreBtn.style.display = 'none';
            Notiflix.Notify.info('Osiągnąłeś koniec wyników wyszukiwania.');
        } else {
            loadMoreBtn.style.display = 'block';
        }
    } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
        Notiflix.Notify.failure('Wystąpił błąd podczas pobierania danych.');
    }
}

function renderImages(images) {
    const imageCards = images.map((image) => createImageCard(image));
    gallery.insertAdjacentHTML('beforeend', imageCards.join(''));
}

function createImageCard(image) {
    return `
        <div class="photo-card">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            <div class="info">
                <p class="info-item"><b>Lubię to:</b> ${image.likes}</p>
                <p class="info-item"><b>Wyświetlenia:</b> ${image.views}</p>
                <p class="info-item"><b>Komentarze:</b> ${image.comments}</p>
                <p class="info-item"><b>Pobrania:</b> ${image.downloads}</p>
            </div>
        </div>
    `;
}

function loadMoreImages() {
    page += 1;
    handleSubmitForm(new Event('submit'));
}
