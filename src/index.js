import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import createCardHtml from './createCardHtml';
import axios from 'axios';
import LoadMoreBtn from './loadMoreBtn';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
// const loadMoreBtn = document.querySelector('[data-action="load-more"]');

let currentPage = 1;
let currentQuery = '';

const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

async function fetchData() {
  const BASE_URL = "https://pixabay.com/api/";
  const API_KEY = '36854264-eb4d11c0d5687864ceed52463';
  const params = new URLSearchParams({
    key: API_KEY,
    q: currentQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: 40
  });

  try {
    const response = await axios.get(`${BASE_URL}?${params.toString()}`);
      return response.data;
      
  } catch (error) {
    throw new Error('An error occurred while fetching images.');
  }
}

const renderGallery = (images) => {
  const cardsHtml = images.map((image) => createCardHtml(image)).join('');
  gallery.insertAdjacentHTML('beforeend', cardsHtml);

  const lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
};

const handleFormSubmit = async (event) => {
  event.preventDefault();

  currentQuery = event.currentTarget.elements.searchQuery.value.trim();

  if (currentQuery === '') {
    return;
  }

  currentPage = 1;  
  gallery.innerHTML = '';

  try {
    Notiflix.Loading.standard('Loading...');

    const data = await fetchData();
    const { hits, totalHits } = data;

    Notiflix.Loading.remove();

    if (hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderGallery(hits);
      
      if (hits.length < totalHits) {
          loadMoreBtn.show();
          loadMoreBtn.disable();
          loadMoreBtn.enable();
        Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
      } else {
        loadMoreBtn.hide();
        Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    }

  } catch (error) {
        Notiflix.Loading.remove();
        Notiflix.Notify.failure('Failed to fetch data. Please try again later.');
  }
};

form.addEventListener('submit', handleFormSubmit);

loadMoreBtn.refs.button.addEventListener('click', async () => {
  currentPage += 1;
  try {
    const data = await fetchData();
    const { hits } = data;

    renderGallery(hits);
  } catch (error) {
    console.error(error);
  }
});
