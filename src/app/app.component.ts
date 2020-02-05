import { Component } from '@angular/core';
import { PaginatorConfig } from './pagination/paginator.config';
import { UsersQuery } from './stores/akita-store/users.query';
import { UsersService } from './stores/akita-store/users.service';
import { PetServiceStub } from './stores/pet-stub-store/pet-service';
import { UserServiceStub } from './stores/user-stub-store/users-service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	petsConfig: PaginatorConfig;
	usersConfig: PaginatorConfig;

	constructor(
		private userServiceStub: UserServiceStub,
		private usersService: UsersService,
		private usersQuery: UsersQuery,
		private petsService: PetServiceStub
	) {
		this.petsConfig = {
			dataSource: this.petsService.getDataSource()
		};

		this.usersConfig = {
			dataSource: this.usersQuery
		};
	}

	updateUser() {
		this.usersService.update(1, { firstName: 'Dan'});
	}
}
