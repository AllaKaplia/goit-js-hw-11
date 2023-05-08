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


refs.searchForm.addEventListener('submit', onSearchImages);
loadMoreBtn.refs.button.addEventListener('click', axiosImages);

async function onSearchImages(evt) {
    try {
        evt.preventDefault();

        loadMoreBtn.hide();
        pixabaySearchService.resetPage();
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

        if (data.totalHits < (pixabaySearchService.page * pixabaySearchService.per_page)) {
            refs.galleryImages.insertAdjacentHTML('beforeend', createCardsImagesMarkup(data.hits));
            Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
            return;
        }


        refs.galleryImages.insertAdjacentHTML('beforeend', createCardsImagesMarkup(data.hits));
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
  
  // Refactor axiosImages function
window.addEventListener('scroll', async () => {
    const data = await pixabaySearchService.fetchMoreImages();
    if (!data.data) return;
  
    refs.galleryImages.insertAdjacentHTML('beforeend', createCardsImagesMarkup(data.data.hits));
    gallery.refresh();
});