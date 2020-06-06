/*====================================
=            ON DOM READY            =
====================================*/
$(function() {
  $('.toggle-nav').click(function() {
    // Calling a function in case you want to expand upon this.
    toggleNav();
  });
});


/*========================================
=            CUSTOM FUNCTIONS            =
========================================*/
function toggleNav() {
if ($('#site-wrapper').hasClass('show-nav')) {
  // Do things on Nav Close
  $('#site-wrapper').removeClass('show-nav');
} else {
  // Do things on Nav Open
  $('#site-wrapper').addClass('show-nav');
}
if ($('#toggleMenu').hasClass('fa-chevron-right')) {
  $('#toggleMenu').addClass('fa-chevron-left');
  $('#toggleMenu').removeClass('fa-chevron-right');
}
else {
  $('#toggleMenu').addClass('fa-chevron-right');
  $('#toggleMenu').removeClass('fa-chevron-left');
}

//$('#site-wrapper').toggleClass('show-nav');
}

$(window).scroll(function () {
  $('#site-menu').css('top', $(window).scrollTop());
}
);