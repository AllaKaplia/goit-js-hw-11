import axios from 'axios';
export default class PixabaySearchService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40;
        this.KEY = '35944916-0a227103958c105cd60c29ad2'
    }
    async fetchImages() {
        return await axios.get(`https://pixabay.com/api/?key=${this.KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`)
            .then(response => {
                return response;
            })
            .then(data =>
                {this.page += 1;
                    return data;
            })
            .catch(error => {
                console.error(error);
            });
    }
    resetPage() {
        this.page = 1;
    }
    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}