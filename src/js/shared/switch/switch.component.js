import { Component, getContext } from "rxcomp";

export class SwitchComponent extends Component {

	get path() {
		const w = 40;
		const w2 = 60;
		const h = window.innerHeight;
		return `path('M0,0 L${w},0 C${w},${h * .25},${w},${h * .75},${w},${h} L${w},${h} L0,${h} L0,0 Z')`;
	}

	get overPath() {
		const w = 40;
		const w2 = 60;
		const h = window.innerHeight;
		return `path('M0,0 L${w},0 C${w2},${h * .25},${w2},${h * .75},${w},${h} L${w},${h} L0,${h} L0,0 Z')`;
	}

	onInit() {
		const { node } = getContext(this);
		let over = false;
		const onResize = () => {
			node.style.clipPath = over ? this.overPath : this.path;
		};
		const onOver = () => {
			over = true;
			gsap.to(node, {
				duration: 0.5,
				ease: Elastic.easeOut,
				'clip-path': this.overPath,
			});
		};
		const onOut = () => {
			over = false;
			gsap.to(node, {
				duration: 0.5,
				ease: Elastic.easeOut,
				'clip-path': this.path,
			});
		};
		onResize();
		window.addEventListener('resize', onResize);
		node.addEventListener('mouseover', onOver);
		node.addEventListener('mouseout', onOut);
	}

}

SwitchComponent.meta = {
	selector: '[switch]'
};

