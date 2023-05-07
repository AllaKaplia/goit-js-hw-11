import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import refs from './js/refs';
import PixabaySearchService from './js/searchClassService';
import LoadMoreBtn from './js/load-more-btn';
import { createCardsImagesMarkup } from './js/markupService';
import { smoothScroll } from './js/scroll';


const pixabaySearchService = new PixabaySearchService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

const gallery = new SimpleLightbox('.gallery a');

let currentPage = 1;


refs.searchForm.addEventListener('submit', onSearchImages);
loadMoreBtn.refs.button.addEventListener('click', axiosImages);

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
            pixabaySearchService.resetPage();
            clearCardsGallery();
            return;
        }

        loadMoreBtn.disable();
        const data = await pixabaySearchService.fetchImages();

        loadMoreBtn.show();
        
        if(data.hits.length === 0){
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        }
        pixabaySearchService.resetPage();

        const arr = await pixabaySearchService.fetchImages();
        gallery.refresh();

        if (data.totalHits < (pixabaySearchService.page * pixabaySearchService.per_page)) {
            Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
            refs.galleryImages.insertAdjacentHTML('beforeend', createCardsImagesMarkup(arr.hits));
            loadMoreBtn.hide();
            return;
        }

        loadMoreBtn.enable();
        refs.galleryImages.insertAdjacentHTML('beforeend', createCardsImagesMarkup(arr.hits));
        smoothScroll();
        gallery.refresh();
    } catch (error) {
        console.log(error);
        Notiflix.Notify.failure(`Sorry, an error occurred. Please try again`);
    }
}

function clearCardsGallery() {
    refs.galleryImages.innerHTML = '';
}

async function axiosImages() {
    currentPage += 1;
  
    try {
        const arr = await pixabaySearchService.fetchImages();
        refs.galleryImages.insertAdjacentHTML(
          'beforeend',
          createCardsImagesMarkup(arr.hits, currentPage)
        );

        gallery.refresh(); 
    } catch (error) {
        console.log(error);
    }
}
