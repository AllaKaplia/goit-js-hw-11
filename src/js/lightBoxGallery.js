import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

export function openLightBoxGallery() {

    let gallery = new SimpleLightbox('.gallery a', { 
        overlayOpacity: 0.3,
        captionSelector: "img",
        captionType: "attr",
        captionDelay: 250,
        captionsData: "alt",
    });

    gallery.refresh();
}