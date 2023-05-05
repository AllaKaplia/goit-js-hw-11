import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import refs from './js/refs';
import PixabaySearchService from './js/searchClassService';
import LoadMoreBtn from './js/load-more-btn';
import { createCardsImagesMarkup } from "./js/markupService";


const pixabaySearchService = new PixabaySearchService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});


refs.searchForm.addEventListener('submit', onSearchImages);
loadMoreBtn.refs.button.addEventListener('click', axiosImages);

function onSearchImages(evt) {
    evt.preventDefault();

    pixabaySearchService.query = evt.currentTarget.elements.searchQuery.value.trim();

    if(pixabaySearchService.query === ''){
        return Notiflix.Notify.info('You need to enter a word to start the search');
    }

    loadMoreBtn.show();
    pixabaySearchService.resetPage ();
    clearCardsGallery();
    axiosImages();
}

function axiosImages() {
    loadMoreBtn.disable();
    pixabaySearchService.fetchImages().then(hits => {
        renderResultSearchCardsImages(hits)
        loadMoreBtn.enable();
    });
}

function renderResultSearchCardsImages(hits) {
    if (!hits){
        return;
    }

    if(hits.length > 1 && hits.length <= 40) {
        refs.galleryImages.insertAdjacentHTML('beforeend', createCardsImagesMarkup(hits));
    }
}

function clearCardsGallery() {
    refs.galleryImages.innerHTML = '';
}