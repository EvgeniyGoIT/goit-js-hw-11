import fetchData from './pixabuyAPI';

export function renderGallery(images) {
  const cardsHtml = images.map((image) => createCardHtml(image)).join('');
  gallery.innerHTML = cardsHtml;

  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
};

export function createCardHtml(image) {
  return `
    <div class="photo-card">
      <a href="${image.largeImageURL}">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${image.views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${image.downloads}
        </p>
      </div>
    </div>
  `;
};

export async function handleFormSubmit(event) {
  event.preventDefault();

  const searchQuery = form.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }

  gallery.innerHTML = ''; // Очистить галерею перед новым поиском

  try {
    Notiflix.Loading.standard('Loading...');

    const { hits, totalHits } = await fetchData(searchQuery);
    Notiflix.Loading.remove();

    if (hits.length === 0) {
      Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    renderGallery(hits);

    if (hits.length < totalHits) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    }
  } catch (error) {
    Notiflix.Loading.remove();
    Notiflix.Notify.failure('Failed to fetch data. Please try again later.');
  }
};


export async function handleLoadMoreBtnClick() {
  const searchQuery = form.elements.searchQuery.value.trim();
  const currentPage = Math.ceil(gallery.children.length / 40) + 1;

  try {
    Notiflix.Loading.standard('Loading more...');

    const { hits, totalHits } = await fetchData(searchQuery, currentPage);
    Notiflix.Loading.remove();

    if (hits.length === 0) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.warning('We\'re sorry, but you\'ve reached the end of search results.');
      return;
    }

    renderGallery(hits);

    if (gallery.children.length >= totalHits) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    scrollToNextGroup();
  } catch (error) {
    Notiflix.Loading.remove();
    Notiflix.Notify.failure('Failed to fetch more data. Please try again later.');
  }
};

export function scrollToNextGroup() {
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};