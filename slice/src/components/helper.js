export const checkInit = (selector, name, init)=> {

	let nodes = document.querySelectorAll(`${selector}`);

	Array.prototype.forEach.call(nodes, function (item) {
		if(!item.classList.contains(`${name}_processed`)) {
			item.classList.add(`${name}_processed`);
			init(item);
		}
	});
};
