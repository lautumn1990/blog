var SOURCES = window.TEXT_VARIABLES.sources;
var PAHTS = window.TEXT_VARIABLES.paths;
window.Lazyload.js([SOURCES.jquery, PAHTS.search_js], function() {
  window.simpleJekyllSearch = SimpleJekyllSearch({
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('results-container'),
    json: '/assets/search.json?v={{ "now" | date: "%s"}}',
    noResultsText: 'No results found',
    limit: 15,
    searchResultTemplate: '<li class="search-result__item"><a href="{url}" class="button">{title}</a></li>',
    onSearch: function() {
      console.log("on search")
    }
  })

  console.log($)
  // search box
  var $result = $('#results-container'), $resultItems;
  var lastActiveIndex, activeIndex;

  function clear() {
    $result.html(null);

  }
  function onInputNotEmpty() {
    $resultItems = $('.search-result__item'); 
    activeIndex = 0;
    $resultItems.eq(0).addClass('active');
  }
  function refreshResultItems(){
    $resultItems = $('.search-result__item'); 
  }

  search.clear = clear;
  search.onInputNotEmpty = onInputNotEmpty;

  function updateResultItems() {
    lastActiveIndex >= 0 && $resultItems.eq(lastActiveIndex).removeClass('active');
    activeIndex >= 0 && $resultItems.eq(activeIndex).addClass('active');
  }

  function moveActiveIndex(direction) {
    refreshResultItems();
    var itemsCount = $resultItems ? $resultItems.length : 0;
    console.log(itemsCount,direction,$resultItems)
    if (itemsCount > 1) {
      lastActiveIndex = activeIndex;
      if (direction === 'up') {
        activeIndex = (activeIndex - 1 + itemsCount) % itemsCount;
      } else if (direction === 'down') {
        activeIndex = (activeIndex + 1 + itemsCount) % itemsCount;
      }
      updateResultItems();
    }
  }

  // Char Code: 13  Enter, 37  ⬅, 38  ⬆, 39  ➡, 40  ⬇
  $(window).on('keyup', function(e) {
    var modalVisible = search.getModalVisible && search.getModalVisible();
    if (modalVisible) {
      if (e.which === 38) {
        modalVisible && moveActiveIndex('up');
      } else if (e.which === 40) {
        modalVisible && moveActiveIndex('down');
      } else if (e.which === 13) {
        modalVisible && $resultItems && activeIndex >= 0 && $resultItems.eq(activeIndex).children('a')[0].click();
      }
    }
  });

  $result.on('mouseover', '.search-result__item > a', function() {
    var itemIndex = $(this).parent().data('index');
    itemIndex >= 0 && (lastActiveIndex = activeIndex, activeIndex = itemIndex, updateResultItems());
  });
})