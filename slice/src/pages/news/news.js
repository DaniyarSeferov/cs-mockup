import './news.scss';

if (typeof Drupal !== "undefined" && Drupal.behaviors) {
	Drupal.behaviors.ADNew = {
		attach: () => {
			init();
		},
		completedCallback: () => {/*Do nothing. But it's here in case other modules/themes want to override it.*/	}
	}
} else {
	document.addEventListener("DOMContentLoaded", () => {
		init();
	});
}

function init() {

}
