'use strict';

var articleView = {};

articleView.populateFilters = function() {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      var val = $(this).find('address a').text();
      var optionTag = `<option value="${val}">${val}</option>`;

      if ($(`#author-filter option[value="${val}"]`).length === 0) {
        $('#author-filter').append(optionTag);
      }

      val = $(this).attr('data-category');
      optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = function() {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = function() {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    ////////////////////////////////////////////////////////////////////////
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = function() {
  $('.main-nav').on('click', '.tab', function() {
    $('.tab-content').hide();
    $('#' + $(this).data('content')).fadeIn();
  });

  $('.main-nav .tab:first').click();
};

articleView.setTeasers = function() {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    //////e.preventDefault so that it's not reloading the page when we hit the submit button
    if ($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

articleView.initNewArticlePage = function() {
 // TODO: Make the tabs work. Right now, you're seeing all the tab content (items with a class of tab-content) on the page at once. The section with the id of "write" should show when the "write" tab is clicked; it is also the default and should be shown on page load. The section with the id of "articles" should show when the "preview" tab is clicked.
 /////////////////////////////////////////////////////////////
  articleView.handleMainNav();
  articleView.setTeasers();

  // TODO: Hide the article-export section on page load
  ////////////////////////////////////////////////////////
  $('#article-json').hide();

  $('#article-json').on('focus', function(){
    this.select();
  });

  // TODO: Add an event handler to update the preview and the article-export field if any inputs change.
  $('#new-article-form').on('submit', articleView.create);

};

// this is the function that generates the preview and shows the export field
articleView.create = function(e) {
  // TODO: Set up a var to hold the new article we are creating.
  // Clear out the #articles element, so we can put in the updated preview
  ///////////////////////////////////////////////////////////////////////
    e.preventDefault();
    var articleData = {};
    $('#new-article-preview').remove();

  // TODO: Instantiate an article based on what's in the form fields:
    var $form = $(this);
    articleData.title = $form.find('#title').val();
    articleData.body = $form.find('#body').val();
    articleData.author = $form.find('#author').val();
    articleData.authorUrl = $form.find('#author-url').val();
    articleData.category = $form.find('#category').val();
    if ($form.find('#published').is(':checked')) articleData.publishedOn = new Date();
    debugger;
    ////////debugger is used to manipulate object using browser console
    ///////////for example using browser console I can change the name of the author by typing the following into the console     articleData.author = 'something else'
    // //The following 4 expressions are the same
    // 1. $form.find('#published').is(':checked') ? new Date() : undefined;
    //
    // 2. if($form.find('#published').is(':checked')) {
    //   articleData.publishedOn = new Date();
    // }
    //
    // 3. if ($form.find('#published').is(':checked')) articleData.publishedOn = new Date();
    // 4. articleData.publishedOn = $form.find('#published').is(':checked') ? new Date() : undefined;

    ////////////below is the ternary expression: before the ? is the if statement; if the checkbox for the element with an id of published is checked then give it a new data and time; otherwise set it to undefined
    // articleData.publishedOn = $form.find('#published').is(':checked') ? new Date() : undefined;
    // /////////////////////////////////////////new Date();
    // if($form.find('#published').is(':checked')) {
    //   articleData.publishedOn = new Date();
    // }
    //////////////below is a single line if statement
    //3. if ($form.find('#published').is(':checked')) articleData.publishedOn = new Date();
    ////browser console $('#published').attr('checked')   DOES NOT work
    ////browser console $('#published:checked').length ==========find something with an id of published with the attribute of/pseudoselector of checked..........syntax work but why .length? because there could be more than 1 checkbox ========.length = 1 means there is one checked checkbox
    ///////browser console $('#published').is(':checked')    SYNTAX WORKS   .is with pseudoselector :checked

  // TODO: Use our interface to the Handblebars template to put the article preview into the DOM:
  //////grab the article-template then convert it into html .Then passing it inside the Handblebars.compile() function, which returns a function that we store inside the var template
    var template = Handblebars.compile($('#article-template').html());

  // TODO: The new articles we create will be shown as JSON in an element in our article-export section. From there, we can copy/paste the JSON into our source data file.
    // Set up this "export" functionality. When data is inputted into the form, that data should be converted to stringified JSON. Then, display that JSON in the element inside the article-export section. The article-export section was hidden on page load; make sure to show it as soon as data is entered in the form.
    ///////////////////////////////////////////////////
    ////prepend so it shows up as the first articleData
    ////wrap template() function inside a jquery so we can access to jquery method
    /////call the template() function and passind inside it the articleData as the parameter
    /////populate the template with the data we pull from the form and wrap that string in a jquery object so we can call a jquery method on it.  Then we change its id attribute to new-article-preview.  Then we prepend it to the element with the id of articles
  $('#articles').prepend($(template(articleData)).attr('id', 'new-article-preview'));

  $('.tab[data-content="articles"]').click()  //////????????????? purpose
  ////find something with the class of tab that has data-content equal to articles
};


articleView.initIndexPage = function() {
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};
