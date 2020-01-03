import { Component, Inject } from '@angular/core';
import { DataSource } from './pagination/data-source';
import { PAGINATOR } from './pagination/injection-tokens';
import { UserService } from './pagination/pagination-service';
import { Paginator } from './pagination/paginator';
import { UsersQuery } from './pagination/state/users.query';
import { UsersService } from './pagination/state/users.service';

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
		this.paginator.setDataSource(this.dataSource.getData());
		this.paginator.setDataRequest(this.userService.getPage.bind(this.userService));
	}

	private setAkitaSource() {
		this.paginator.setDataSource(this.usersQuery.getData());
		this.paginator.setDataRequest(this.usersService.getPage.bind(this.usersService));
	}
}
