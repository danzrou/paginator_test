import { Component, HostBinding, Input } from '@angular/core';
import { User } from '../../user';

@Component({
	selector: 'app-user-table',
	templateUrl: './user-table.component.html',
	styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent {
	@Input() users: User[];
	@Input() title: string;

	@HostBinding('class.user-table') cls = true;
}
