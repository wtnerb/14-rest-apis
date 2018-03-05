'use strict';
var app = app || {};

(function(module) {
  $('.icon-menu').on('click', function(event) {
    $('.nav-menu').slideToggle(350);
  })

  function resetView() {
    $('.container').hide();
    $('.nav-menu').slideUp(350);
  }

  const bookView = {};

  bookView.initIndexPage = function(ctx, next) {
    resetView();
    $('.book-view').show();
    $('#book-list').empty();
    module.Book.all.map(book => $('#book-list').append(book.toHtml()));
    next()
  }

  bookView.initDetailPage = function(ctx, next) {
    resetView();
    $('.detail-view').show();
    $('.book-detail').empty();
    let template = Handlebars.compile($('#book-detail-template').text());
    $('.book-detail').append(template(ctx.book));

    $('#update-btn').on('click', function() {
      page(`/books/${$(this).data('id')}/update`);
    });

    $('#delete-btn').on('click', function() {
      module.Book.destroy($(this).data('id'));
    });
    next()
  }

  bookView.initCreateFormPage = function() {
    resetView();
    $('.create-view').show();
    $('#create-form').on('submit', function(event) {
      event.preventDefault();

      let book = {
        title: event.target.title.value,
        author: event.target.author.value,
        isbn: event.target.isbn.value,
        image_url: event.target.image_url.value,
        description: event.target.description.value,
      };

      module.Book.create(book);
    })
  }

  bookView.initUpdateFormPage = function(ctx) {
    resetView();
    $('.update-view').show()
    $('#update-form input[name="title"]').val(ctx.book.title);
    $('#update-form input[name="author"]').val(ctx.book.author);
    $('#update-form input[name="isbn"]').val(ctx.book.isbn);
    $('#update-form input[name="image_url"]').val(ctx.book.image_url);
    $('#update-form textarea[name="description"]').val(ctx.book.description);

    $('#update-form').on('submit', function(event) {
      event.preventDefault();

      let book = {
        book_id: ctx.book.book_id,
        title: event.target.title.value,
        author: event.target.author.value,
        isbn: event.target.isbn.value,
        image_url: event.target.image_url.value,
        description: event.target.description.value,
      };

      module.Book.update(book, book.book_id);
    })
  };

// COMMENT: What is the purpose of this method?
// this method sets up the search form with an event listener that will handle the actual searching as necessary.
  bookView.initSearchFormPage = function() {
    resetView();
    $('.search-view').show();
    $('#search-form').on('submit', function(event) {
      // COMMENT: What default behavior is being prevented here?
      // A submit event has the default behavior of refreshing the page. This stops that.
      event.preventDefault();

      // COMMENT: What is the event.target, below? What will happen if the user does not provide the information needed for the title, author, or isbn properties?
      // event.target is the search form selected above by its id. Any property that is not defined defaults to an empty string which is just fine.
      let book = {
        title: event.target.title.value || '',
        author: event.target.author.value || '',
        isbn: event.target.isbn.value || '',
      };

      module.Book.find(book, bookView.initSearchResultsPage);

      // COMMENT: Why are these values set to an empty string?
      // At this point, the search has been initiated and the details from the form have been handled. By setting the values to an empty string the user doesn't accidentally perfom the same search twice.
      event.target.title.value = '';
      event.target.author.value = '';
      event.target.isbn.value = '';
    })
  }

  // COMMENT: What is the purpose of this method?
  // Once a search has been requested by the user, this will display the results of that search. 
  bookView.initSearchResultsPage = function() {
    resetView();
    $('.search-results').show();
    $('#search-list').empty();

    // COMMENT: Explain how the .map() method is being used below.
    // the map method looks at each book retrieved by Book.find (which matches the criteria passed to Book.find) and appends it the the search list.
    module.Book.all.map(book => $('#search-list').append(book.toHtml()));
    $('.detail-button a').text('Add to list').attr('href', '/');
    $('.detail-button').on('click', function(e) {
      // COMMENT: Explain the following line of code.
      // this will, when a detail button is clicked, step up from that button to the div class of 'book-overlay' that contains it, up the to div class of 'book-container' that contains that, and one more time up to the li class of 'book-items' which has the a data-bookid attribute. Having stepped up that far, the value of that book id is then passed into Book.findOne to get the detail view on that book.
      module.Book.findOne($(this).parent().parent().parent().data('bookid'))
    });
  }

  // COMMENT: Explain the following line of code. 
  // This attatches the bookView object we've been building to the module object. Then whatever object gets passed into the IIFE as an argument will have the bookView object attatched to it at the end.
  module.bookView = bookView;
  
  // COMMENT: Explain the following line of code.
  // this puts the app object as the argument in the IIFE call. As such, the app object can be referred to internally by module and have only the useful properties/methods exported from the IIFE. 
})(app)

