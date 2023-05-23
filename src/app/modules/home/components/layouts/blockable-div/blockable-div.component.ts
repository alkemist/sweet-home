import {ChangeDetectionStrategy, Component, ElementRef, Input} from "@angular/core";
import {BlockableUI} from "primeng/api";

@Component({
	selector: "blockable-div",
	template: `
    <ng-content></ng-content>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockableDivComponent implements BlockableUI {
	@Input() style: any;
	@Input() class: any;

	constructor(private el: ElementRef) {
	}

	getBlockableElement(): HTMLElement {
		return this.el.nativeElement.children[0];
	}
}
