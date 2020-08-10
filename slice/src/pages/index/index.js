import './index.scss';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';
import * as Masonry from 'masonry-layout/masonry';
import * as ImagesLoaded from 'imagesloaded/imagesloaded';
import VideoModal from "../../components/video-modal/video-modal";

if (typeof Drupal !== "undefined" && Drupal.behaviors) {
	(function ($, Drupal) {
		Drupal.behaviors.csf = {
			attach: function (context, settings) {
				init();
			},
			completedCallback: () => {/*Do nothing. But it's here in case other modules/themes want to override it.*/	}
		}
	})(jQuery, Drupal);
} else {
	document.addEventListener("DOMContentLoaded", () => {
		init();
	});
}

function init() {
	initCarousels();
	initGallery();
	new VideoModal();
}

function initCarousels() {
	if(typeof $.fn.owlCarousel === "undefined") return;
	$('.owl-carousel__news').owlCarousel({
		dots: false,
		nav: true,
		items: 3,
		margin: 20,
		loop: true,
		responsive: {
			768: {
				loop: false,
			}
		}
	});

	$('.owl-carousel__videos').owlCarousel({
		dots: false,
		nav: true,
		items: 2,
		margin: 0,
		loop: true,
		responsive: {
			768: {
				loop: false,
			}
		}
	});

	$('.owl-carousel__sponsors').owlCarousel({
		dots: false,
		nav: true,
		items: 5,
		margin: 20,
		loop: true,
		responsive: {
			768: {
				loop: false,
			}
		}
	});
}

function initGallery() {
	var grid = document.querySelector('.grid');

	if (grid) {
		var msnry = new Masonry( grid, {
			itemSelector: '.grid-item',
			columnWidth: '.grid-sizer',
			percentPosition: true
		});

		ImagesLoaded( grid ).on( 'progress', function() {
			msnry.layout();
		});
	}
}