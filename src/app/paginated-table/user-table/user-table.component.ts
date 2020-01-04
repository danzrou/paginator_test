import { Component, HostBinding, Input } from '@angular/core';
import { User } from '../../stores/user-stub-store/user';

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
		return item && Object.keys(item) || [];
	}
}
