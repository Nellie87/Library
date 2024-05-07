	
	$(document).ready(function() {


// Drop Down Section



    $(document).on('click', '.dropdown-toggle-1',function(){
       $(this).parent().siblings().find('.dropdown-menu').hide();
       $(this).next('.dropdown-menu').toggle(); 
    });
	$(document).on('click', '.fa-edit',function(){
		$(this).parent().addClass('editable');
	 });

	 $('.digit-group').find('input').each(function() {
		$(this).attr('maxlength', 1);
		$(this).on('keyup', function(e) {
			var parent = $($(this).parent());
			
			if(e.keyCode === 8 || e.keyCode === 37) {
				var prev = parent.find('input#' + $(this).data('previous'));
				
				if(prev.length) {
					$(prev).select();
				}
			} else if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
				var next = parent.find('input#' + $(this).data('next'));
				
				if(next.length) {
					$(next).select();
				} else {
					if(parent.data('autosubmit')) {
						parent.submit();
					}
				}
			}
		});
	});
	document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
		const dropZoneElement = inputElement.closest(".drop-zone");
	  
		dropZoneElement.addEventListener("click", (e) => {
		  inputElement.click();
		});
	  
		inputElement.addEventListener("change", (e) => {
	
			if(inputElement.files[0]){	
				if (inputElement.files[0].name.match(/\.(jpg|jpeg|png)$/)) {	
					if (inputElement.files.length>0) {
						updateThumbnail(dropZoneElement, inputElement.files[0]);
					}
				}
			}else{
				updateThumbnail(dropZoneElement, false);
			}
		});
	  
		dropZoneElement.addEventListener("dragover", (e) => {
		  e.preventDefault();
		  dropZoneElement.classList.add("drop-zone--over");
		});
	  
		["dragleave", "dragend"].forEach((type) => {
		  dropZoneElement.addEventListener(type, (e) => {
			dropZoneElement.classList.remove("drop-zone--over");
		  });
		});
	  
		dropZoneElement.addEventListener("drop", (e) => {
		  e.preventDefault();
	  
		  if (e.dataTransfer.files.length) {
			inputElement.files = e.dataTransfer.files;
			updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
		  }
	  
		  dropZoneElement.classList.remove("drop-zone--over");
		});
	  });

	  
	  /**
	   * Updates the thumbnail on a drop zone element.
	   *
	   * @param {HTMLElement} dropZoneElement
	   * @param {File} file
	   */
	  function updateThumbnail(dropZoneElement, file) {
		  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");
		 
	  
		// First time - remove the prompt
		if (dropZoneElement.querySelector(".drop-zone__prompt")) {
		  dropZoneElement.querySelector(".drop-zone__prompt").classList.add('d-none');
		}

		if(!file){
			dropZoneElement.removeChild(thumbnailElement);
			dropZoneElement.querySelector(".drop-zone__prompt").classList.remove('d-none');
			return;
		}
	  
		// First time - there is no thumbnail element, so lets create it
		if (!thumbnailElement) {
		  thumbnailElement = document.createElement("div");
		  thumbnailElement.classList.add("drop-zone__thumb");
		  dropZoneElement.appendChild(thumbnailElement);
		}
	  
		thumbnailElement.dataset.label = file.name;
	  
		// Show thumbnail for image files
		if (file.type.startsWith("image/")) {
		  const reader = new FileReader();
	  
		  reader.readAsDataURL(file);
		  reader.onload = () => {
			thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
		  };
		} else {
		  thumbnailElement.style.backgroundImage = null;
		}
	  }
	  
	$(function() {
		$("#price").on("click",function() {
		  $(".price-wrap").toggle(this.checked);
		});
	  });
	 $(document).on('click', '.cat__img',function(event){
		$('tr td').removeClass("active");
		$(this).parent('tr td').addClass("active");
		event.stopPropagation();
	 });
	 $(document).on('click', '.cat__wrap',function(event){
		event.stopPropagation();
	});

	 $(document).on('click', 'body',function(event){
		$('tr td').removeClass("active");
	 });

	
	 $(document).on('click', '.saveButton',function(){
		$(this).parent().removeClass('editable');
	 });

	$(document).on('click', '.addButton',function(){
		$('.add-btn-wrap').addClass('addActive');
	 });
	 $(document).on('click', '.add_input',function(){
		$('.add-btn-wrap').removeClass('addActive');
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



// Drop Down Section Ends 
		$(document).on('click', '.menu-toggle-button',function() {
			$('body').toggleClass('opne-menu');
		});
		// Side Bar Area Js
		$(document).on('click','#sidebarCollapse' ,function() {
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
	  

	});



  

