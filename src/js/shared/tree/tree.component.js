import { Component } from 'rxcomp';

export class TreeComponent extends Component {

	hasItems(item) {
		return item.items && item.items.length > 0;
	}

	onClick(item) {
		this.tree.forEach(x => {
			x.active = x.id === item.id ? (this.hasItems(item) ? !item.active : true) : false;
		});
		if (item.active) {
			this.open.next(item);
		}
		this.pushChanges();
	}

	onOpen(item) {
		this.open.next(item);
	}

}

TreeComponent.meta = {
	selector: '[tree]',
	inputs: ['tree'],
	outputs: ['open'],
	template: /* html */ `
		<li class="folder" [class]="{ active: item.active }" *for="let item of tree">
			<span [innerHTML]="item.title" (click)="onClick(item)"></span>
			<ul [tree]="item.items" (open)="onOpen($event)"></ul>
		</li>
	`
};
