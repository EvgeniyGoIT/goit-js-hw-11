import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import createCardHtml from './createCardHtml';
import fetchData from './fetchDataApi'
import LoadMoreBtn from './loadMoreBtn';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
// const loadMoreBtn = document.querySelector('[data-action="load-more"]');

let currentPage = 1;
let currentQuery = '';
let totalPages = 0;

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});


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
    loadMoreBtn.hide();

    const data = await fetchData(currentQuery, currentPage);
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
      loadMoreBtn.enable();
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    } else {
      loadMoreBtn.hide();
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
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
    const data = await fetchData(currentQuery, currentPage);
    const { hits, totalHits } = data;

    renderGallery(hits);

    if (currentPage >= Math.ceil(totalHits / 40)) {
      loadMoreBtn.hide();
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.error(error);
  }
});
