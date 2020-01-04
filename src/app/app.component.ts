import { Component, Inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Paginator } from './pagination/paginator';
import { PaginatorConfig } from './pagination/paginator.config';
import { UsersQuery } from './stores/akita-store/users.query';
import { UsersService } from './stores/akita-store/users.service';
import { PetServiceStub } from './stores/pet-stub-store/pet-service';
import { UserServiceStub } from './stores/user-stub-store/users-service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [Paginator]
})
export class AppComponent {
	initialized = false;
	petsConfig: Partial<PaginatorConfig>;

	constructor(
		private paginator: Paginator,
		private userServiceStub: UserServiceStub,
		private usersService: UsersService,
		private usersQuery: UsersQuery,
		private petsService: PetServiceStub
	) {
		this.petsConfig = {
			dataSource: this.petsService.getDataSource(),
			getPageRequest: this.petsService.getPets.bind(this.petsService)
		};

		this.setStubSource();
	}

	manualRequests() {
		this.paginator.setConfig({ makeRequests: false });
		this.paginator.pageChanges
			.pipe(
				switchMap(page =>
					this.paginator.getPage(
						this.userServiceStub.getPage({
							pageSize: 10,
							requestedPage: page,
							searchTerm: ''
						})
					)
				)
			)
			.subscribe();
	}

	onSelected(value: number) {
		switch (+value) {
			case 1:
				this.setStubSource();
				break;
			case 2:
				this.setAkitaSource();
				break;
			case 3:
				this.manualRequests();
				break;
		}
		this.initialized = true;
	}

	private setStubSource() {
		this.paginator.setConfig({
			getPageRequest: this.userServiceStub.getPage.bind(this.userServiceStub),
			dataSource: this.userServiceStub.getDataSource()
		});
	}

	private setAkitaSource() {
		this.paginator.setConfig({
			dataSource: this.usersQuery,
			getPageRequest: this.usersService.getPage.bind(this.usersService)
		});
	}
}
