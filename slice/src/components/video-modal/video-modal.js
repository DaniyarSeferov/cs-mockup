import './video-modal.scss';

class VideoModal {
	constructor() {
		let trigger = $("body").find('[data-toggle="modal"]');

		trigger.click(function () {
			let theModal = $(this).data("target"),
				videoSrc = $(this).attr("data-video");

			$(theModal + ' iframe').attr('src', videoSrc);
			$(theModal + ' button.close').click(function () {
				$(theModal + ' iframe').attr('src', videoSrc);
			});
		});
	}
}

export default VideoModal;