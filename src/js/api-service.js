export default class apiService {
  constructor() {
    this.page = 1;
    this.query = '';
  }
  async fetchImg() {
    const API_KEY = '22469434-62330606312f34e078b383df4';
    const URL = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.query}&page=${this.page}&per_page=12&key=${API_KEY} `;
    updPage();
    const res = await fetch(URL);
    return await res.json();
  }
  clearRes() {
    this.page = 1;
  }
  updPage() {
    this.page += 1;
  }

  set query(newQuery) {
    this.query = newQuery;
  }
  get query() {
    return this.query;
  }
}
