import { Component, HostBinding, Input } from '@angular/core';

@Component({
	selector: 'app-user-table',
	templateUrl: './user-table.component.html',
	styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent<T> {
	@Input() data: T[];
	@Input() title: string;

	@HostBinding('class.user-table') cls = true;

	getKeys(item: T) {
		return (
			(item &&
				Object.keys(item).sort((a, b) => {
					if (a.toLowerCase() === 'id') return -1;
					return 0;
				})) ||
			[]
		);
	}
}
