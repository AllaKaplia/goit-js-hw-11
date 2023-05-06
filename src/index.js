import './css/styles.css';
import Notiflix from 'notiflix';
import refs from './js/refs';
import PixabaySearchService from './js/searchClassService';
import LoadMoreBtn from './js/load-more-btn';
import { openLightBoxGallery } from './js/lightBoxGallery';
import { createCardsImagesMarkup } from './js/markupService';


const pixabaySearchService = new PixabaySearchService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});


refs.searchForm.addEventListener('submit', onSearchImages);
loadMoreBtn.refs.button.addEventListener('click', axiosImages);

async function onSearchImages(evt) {
    evt.preventDefault();

    loadMoreBtn.hide();
    clearCardsGallery();
    pixabaySearchService.query = evt.currentTarget.elements.searchQuery.value.trim();

    if(pixabaySearchService.query.trim() === ''){
        Notiflix.Notify.info('You need to enter a word to start the search');
        pixabaySearchService.resetPage();
        clearCardsGallery();
        return;
    }

    try {
        const data = await pixabaySearchService.fetchImages();
        console.log(data);
        if (data.totalHits === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
            pixabaySearchService.resetPage();
            return;
        }

        loadMoreBtn.enable();
        loadMoreBtn.show();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        clearCardsGallery();
        refs.galleryImages.insertAdjacentHTML('beforeend', createCardsImagesMarkup(data.hits)); 
        openLightBoxGallery();
        pixabaySearchService.resetPage();
    } catch (error) {
        console.log(error);
        Notiflix.Notify.failure(`Sorry, an error occurred. Please try again`);
    }
}

function clearCardsGallery() {
    refs.galleryImages.innerHTML = '';
}

function axiosImages() {
    pixabaySearchService.incrementPage();
  
    try {
      onSearchImages();
    } catch (error) {
      console.log(error);
    }
}