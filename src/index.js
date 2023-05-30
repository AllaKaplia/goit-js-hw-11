import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import refs from './js/refs';
import PixabaySearchService from './js/searchClassService';
import LoadMoreBtn from './js/load-more-btn';
import { createCardsImagesMarkup } from './js/markupService';
import smoothScroll from './js/scroll';
import clearCardsGallery from './js/clearCards';


const gallery = new SimpleLightbox('.gallery a');
const pixabaySearchService = new PixabaySearchService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});


refs.searchForm.addEventListener('submit', onSearchImages);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreImages);
refs.scrollUp.addEventListener('click', onScrollUpClick);

async function onSearchImages(evt) {
    try {
        evt.preventDefault();

        loadMoreBtn.hide();
        clearCardsGallery();
        pixabaySearchService.query = evt.currentTarget.elements.searchQuery.value.trim();

        if(!pixabaySearchService.query) {
            return;
        }
    
        if(pixabaySearchService.query === ''){
            Notiflix.Notify.info('You need to enter a word to start the search');
            return;
        }

        pixabaySearchService.resetPage();
        axiosSearchImages();
    } catch (error) {
        Notiflix.Notify.failure(`Sorry, an error occurred. Please try again`);
    }
}

async function axiosSearchImages() {
    try {
        const data = await pixabaySearchService.fetchImages();

        if(data.data.hits.length === 0){
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        }

        loadMoreBtn.enable();
        loadMoreBtn.show();
        Notiflix.Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
        refs.galleryImages.insertAdjacentHTML('beforeend', createCardsImagesMarkup(data.data.hits));
        gallery.refresh();
    } catch (error) {
        console.log(error);
    }
}

function onLoadMoreImages() {
    try {
        onLoadingImagesOnNextPages();
    } catch (error) {
        console.log(error);
    }
}

async function onLoadingImagesOnNextPages() {
    try {
        loadMoreBtn.disable();
        const arr = await pixabaySearchService.fetchImages();

        if (arr.data.totalHits < (pixabaySearchService.page * pixabaySearchService.per_page)) {
            Notiflix.Notify.info(`Hooray! We found ${arr.data.totalHits} images.`);
            refs.galleryImages.insertAdjacentHTML('beforeend', createCardsImagesMarkup(arr.data.hits));
            gallery.refresh();
            smoothScroll();
            loadMoreBtn.hide();
            return;
        }

        loadMoreBtn.enable();
        refs.galleryImages.insertAdjacentHTML('beforeend', createCardsImagesMarkup(arr.data.hits));
        smoothScroll();
        gallery.refresh();

        if(arr.data.hits.length === arr.data.totalHits){
            Notify.failure("Hooray! We found ${arr.data.totalHits} images. These are all available images.");
            refs.galleryImages.insertAdjacentHTML('beforeend', createCardsImagesMarkup(arr.data.hits));
            smoothScroll();
            gallery.refresh();
            loadMoreBtn.hide();
            return;
        }
    } catch (error) {
        console.log(error);
    }
}

function onScrollUpClick(evt) {
    console.log(evt.currentTarget);
    if(evt.currentTarget){
        scrollToTop() 
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // плавна прокрутка до верху
}