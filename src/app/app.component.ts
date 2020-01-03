import { Component, Inject } from '@angular/core';
import { UsersQuery } from './pagination/akita-store/users.query';
import { UsersService } from './pagination/akita-store/users.service';
import { PAGINATOR } from './pagination/injection-tokens';
import { Paginator } from './pagination/paginator';
import { DataSource } from './pagination/paging-store/data-source';
import { UserService } from './pagination/paging-store/users-service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [{ provide: PAGINATOR, useClass: Paginator }]
})
export class AppComponent {
	title = 'paginator';

	constructor(
		@Inject(PAGINATOR) private paginator: Paginator,
		private dataSource: DataSource,
		private userService: UserService,
		private usersService: UsersService,
		private usersQuery: UsersQuery
	) {
		// this.setStubSource();
		this.setAkitaSource();
	}

	private setStubSource() {
		this.paginator
			.setDataSource(this.dataSource.getData())
			.setDataRequest(this.userService.getPage.bind(this.userService));
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
}
