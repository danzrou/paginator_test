import { Component, Inject } from '@angular/core';
import { DataSource } from './pagination/data-source';
import { PAGINATOR } from './pagination/injection-tokens';
import { UserService } from './pagination/pagination-service';
import { Paginator } from './pagination/paginator';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [{ provide: PAGINATOR, useClass: Paginator }]
})
export class AppComponent {
	title = 'paginator';

	constructor(
		@Inject(PAGINATOR) paginator: Paginator,
		private dataSource: DataSource,
		private userService: UserService
	) {
		paginator.setDataSource(dataSource.getData());
		paginator.setDataRequest(userService.getPage.bind(userService));
	}
}
