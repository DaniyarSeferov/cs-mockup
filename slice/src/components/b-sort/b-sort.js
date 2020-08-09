import './b-sort.scss'
import * as Helpers from "../helper";
// const $ = jQuery;

window.bSort = class {
	constructor(props = {}) {
		this.name = props.name || `b-sort`;
		this.selector = props.selector || `.${this.name}`;

		Helpers.checkInit(this.selector, this.name, (item) => {
			this.init($(item));
		});
	}

	init($elm) {

		$elm.on('click touch', `.${this.name}__title`, (e) => {
			e.preventDefault();

			console.log(this);
			let $this = $(e.target);
			let $item = $this.closest(`.${this.name}__item`);

			if (!$item.length) return;

			$item.toggleClass(`${this.name}_open`);
			$item.find(`.${this.name}__body`).slideToggle();
		});
	}
};

export default bSort;



