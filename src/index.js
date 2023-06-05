import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';
import fetchData from './pixabuyAPI';
import createCardHtml from './createCardHtml';

const form = document.querySelector('#search-form');
const gallery = document.querySelector(".gallery");

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

document.cookie = "cookieName=value; SameSite=None";

const handleFormSubmit = async (event) => {
  event.preventDefault();

  const searchQuery = form.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }

  gallery.innerHTML = '';

  try {
    Notiflix.Loading.standard('Loading...');

    const { hits, totalHits } = await fetchData(searchQuery);
    Notiflix.Loading.remove();

    if (hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderGallery(hits);

    if (hits.length < totalHits) {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    } else {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    const cardHeight = gallery.firstElementChild.getBoundingClientRect().height;

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  } catch (error) {
    Notiflix.Loading.remove();
    Notiflix.Notify.failure('Failed to fetch data. Please try again later.');
  }
};

form.addEventListener('submit', handleFormSubmit);












