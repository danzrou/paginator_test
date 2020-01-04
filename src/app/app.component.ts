import { Component, Inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { UsersQuery } from './pagination/akita-store/users.query';
import { UsersService } from './pagination/akita-store/users.service';
import { PAGINATOR } from './pagination/injection-tokens';
import { Paginator } from './pagination/paginator';
import { DataSource } from './pagination/paging-store/data-source';
import { UserServiceStub } from './pagination/paging-store/users-service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [{ provide: PAGINATOR, useClass: Paginator }]
})
export class AppComponent {
	initialized = false;

	constructor(
		@Inject(PAGINATOR) private paginator: Paginator,
		private dataSource: DataSource,
		private userServiceStub: UserServiceStub,
		private usersService: UsersService,
		private usersQuery: UsersQuery
	) {}

	private setStubSource() {
		this.paginator
			.setDataSource(this.dataSource.getData())
			.setDataRequest(this.userServiceStub.getPage.bind(this.userServiceStub));
	}

	private setAkitaSource() {
		this.paginator
			.setDataSource(this.usersQuery.getData())
			.setDataRequest(this.usersService.getPage.bind(this.usersService));
	}

	refresh() {
		this.paginator.refreshCurrentPage();
	}

	search(query: string) {
		this.paginator.search(query);
	}

	manualRequests() {
		this.paginator.makeRequests(false);
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
}
