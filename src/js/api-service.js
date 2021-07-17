export default class ApiService {
  constructor() {
    this.page = 1;
    this.query = '';
  }
  async fetchImg() {
    const API_KEY = '22469434-62330606312f34e078b383df4';
    const URL = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.query}&page=${this.page}&per_page=12&key=${API_KEY} `;
    this.updPage();
    const res = await fetch(URL);
    const obj = await res.json();
    return await obj.hits;
  }
  clearRes() {
    this.page = 1;
  }
  updPage() {
    this.page += 1;
  }

  set currentQuery(newQuery) {
    this.query = newQuery;
  }
  get currentQuery() {
    return this.query;
  }
}
