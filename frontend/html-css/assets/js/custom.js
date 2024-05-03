(function($) {
		"use strict";
		
	$(document).ready(function() {


// Drop Down Section

    $('.dropdown-toggle-1').on('click', function(){
       $(this).parent().siblings().find('.dropdown-menu').hide();
       $(this).next('.dropdown-menu').toggle(); 
    });

  $(document).on('click', function(e) 
  {
      var container = $(".dropdown-toggle-1");

      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) 
      {
          container.next('.dropdown-menu').hide();
      }
  });

  });

// Drop Down Section Ends 
		$('.menu-toggle-button').on('click', function() {
			$('body').toggleClass('opne-menu');
		});
		// Side Bar Area Js
		$('#sidebarCollapse').on('click', function() {
			$('#sidebar').toggleClass('active');
		});
		Waves.init();
		Waves.attach('.wave-effect', ['waves-button']);
		Waves.attach('.wave-effect-float', ['waves-button', 'waves-float']);
		$('.slimescroll-id').slimScroll({
			height: 'auto'
		});
		$("#sidebar a").each(function() {
		  var pageUrl = window.location.href.split(/[?#]/)[0];
			if (this.href == pageUrl) {
				$(this).addClass("active");
				$(this).parent().addClass("active"); // add active to li of the current link
				$(this).parent().parent().prev().addClass("active"); // add active class to an anchor
				$(this).parent().parent().prev().click(); // click the item to make it drop
			}
		});

    // Side Bar Area Js Ends

    // Nice Select Active js
    $('.select').niceSelect();
    //  Nice Select Ends    

	$('.top-books').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		autoplay: false,
		autoplaySpeed: 3000,
		dots: false,
		pauseOnHover: false,
		centerPadding: '100px',
		prevArrow: '<button class="slick-prev"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>',
		nextArrow: '<button class="slick-next"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>',
		responsive: [
			{
				breakpoint: 1500,
				settings: {
					slidesToShow: 4,
				}
			},
			{
				breakpoint: 1400,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 1199,
				settings: {
					slidesToShow: 2,
				}
			},
			
			{
				breakpoint: 900	,
				settings: {
					slidesToShow: 1,
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 650,
				settings: {
					slidesToShow: 1,
				}
			}
		]
	});
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		$('.top-books').slick('setPosition');
	  })
	$('.cover-book-wrap .cover-books').slick({
		slidesToShow: 5,
		slidesToScroll: 1,
		autoplay: false,
		autoplaySpeed: 3000,
		dots: false,
		pauseOnHover: false,
		prevArrow: '<button class="slick-prev"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>',
		nextArrow: '<button class="slick-next"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>',
		responsive: [
			{
				breakpoint: 1500,
				settings: {
					slidesToShow: 4,
				}
			},
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 4,
				}
			},
			{
				breakpoint: 650,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 500,
				settings: {
					slidesToShow: 2,
				}
			}
		]
	});
	
	
	  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		$('.cover-book-wrap .cover-books').slick('setPosition');
	  })
	  
})(jQuery);


  

