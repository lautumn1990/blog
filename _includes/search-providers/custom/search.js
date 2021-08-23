window.simpleJekyllSearch = SimpleJekyllSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('results-container'),
  json: '/assets/search.json?v={{ "now" | date: "%s"}}',
  noResultsText: 'No results found',
  limit: 10,
  searchResultTemplate: '<li class="search-result__item"><a href="{url}" class="button">{title}</a></li>'
})